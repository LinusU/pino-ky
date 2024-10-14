import type { Hooks } from 'ky'

declare interface PinoLike {
  debug: (obj: object, msg?: string) => void
  error: (obj: object, msg?: string) => void
}

export default function loggerFactory (pino: PinoLike): Hooks
