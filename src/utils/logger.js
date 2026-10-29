import pino from 'pino'

const logger = pino({
  level: import.meta.env.DEV ? 'debug' : 'warn',
  browser: { asObject: true },
})

export default logger
