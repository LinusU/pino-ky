# Pino: Ky

A [Ky](https://github.com/sindresorhus/ky) handler that logs all requests to a [Pino](https://github.com/pinojs/pino) logger.

## Installation

```sh
npm install --save pino-ky
```

## Compatibility

`pino-ky` | `ky`  | `pino`
--------- | ----- | ------
**`1.x`** | `1.x` | `9.x`

## Usage

```js
import ky from 'ky'
import pino from 'pino'
import pinoKy from 'pino-ky'

const logger = pino({ level: 'debug' })
const kyLogger = pinoKy(logger)
const client = ky.extend({ hooks: kyLogger })

client.get('https://example.com/')
```

Example output with [pino-pretty](https://github.com/pinojs/pino-pretty):

```text
[16:00:33.756] DEBUG (21153): Making GET request to https://example.com/
    method: "GET"
    headers: {}
    url: "https://example.com/"

[16:00:34.230] DEBUG (21153): Got response with status 200 in 472ms
    statusCode: 200
    headers: {
      "accept-ranges": "bytes",
      "age": "466392",
      "cache-control": "max-age=604800",
      "content-encoding": "gzip",
      "content-length": "648",
      "content-type": "text/html; charset=UTF-8",
      "date": "Mon, 14 Oct 2024 14:00:34 GMT",
      "etag": "\"3147526947+gzip\"",
      "expires": "Mon, 21 Oct 2024 14:00:34 GMT",
      "last-modified": "Thu, 17 Oct 2019 07:18:26 GMT",
      "server": "ECAcc (dcd/7D22)",
      "vary": "Accept-Encoding",
      "x-cache": "HIT"
    }
    body: "<!doctype html>..."
    method: "GET"
    url: "https://example.com/"
    duration: "472ms"
```
