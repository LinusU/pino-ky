const kRequestStart = Symbol('requestStart')

function serializeHeaders (headers) {
  const serialized = {}

  for (const [key, value] of headers.entries()) {
    if (key in serialized) {
      if (Array.isArray(serialized[key])) {
        serialized[key].push(value)
      } else {
        serialized[key] = [serialized[key], value]
      }
    } else {
      serialized[key] = value
    }
  }

  return serialized
}

async function serializeResponseBody (response) {
  const text = await response.text().catch(() => '')

  if (text === '') {
    return undefined
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export default function loggerFactory (pino) {
  return {
    beforeRequest: [(request, options) => {
      options[kRequestStart] = Date.now()

      const body = options.json ?? options.form ?? request.body ?? undefined
      const headers = serializeHeaders(request.headers)

      pino.debug({ method: request.method, headers, url: request.url, body }, `Making ${request.method} request to ${request.url}`)
    }],

    afterResponse: [async (request, options, response) => {
      if (!response.ok && options.throwHttpErrors) {
        // This will be logged in the `beforeError` hook
        return
      }

      const start = options[kRequestStart]
      const duration = `${Date.now() - start}ms`

      const body = await serializeResponseBody(response)
      pino.debug({ statusCode: response.status, headers: serializeHeaders(response.headers), body, method: request.method, url: request.url, duration }, `Got response with status ${response.status} in ${duration}`)
    }],

    beforeError: [async (error) => {
      const statusCode = error.response?.status ?? undefined
      const headers = error.response?.headers == null ? undefined : serializeHeaders(error.response.headers)
      const stack = error.stack ?? String(error)

      const method = error.request?.method ?? undefined
      const url = error.request?.url ?? undefined

      const start = error.options?.[kRequestStart] ?? undefined
      const duration = start != null ? `${Date.now() - start}ms` : undefined

      let message = 'request'
      if (method != null) message = `${method} ${message}`
      if (url != null) message = `${message} to ${url}`
      message = `${message} failed`
      if (statusCode != null) message = `${message} with status code ${statusCode}`
      if (duration != null) message = `${message} after ${duration}`

      const body = await serializeResponseBody(error.response)
      pino.error({ statusCode, headers, body, stack, method, url, duration }, message)

      return error
    }]
  }
}
