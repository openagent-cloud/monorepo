/**
 * Simple logger utility that can be disabled in production
 */

// Set this to false to disable all logging in production
const ENABLE_LOGGING = import.meta.env.DEV

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

interface LoggerOptions {
  context?: string
  enabledLevels?: LogLevel[]
}

// Type for log arguments
type LogArgs = [message: string, ...rest: unknown[]] | unknown[]

class Logger {
  private context: string
  private enabledLevels: LogLevel[]
  private isEnabled: boolean

  constructor(options: LoggerOptions = {}) {
    this.context = options.context || 'App'
    this.enabledLevels = options.enabledLevels || ['log', 'info', 'warn', 'error']
    this.isEnabled = ENABLE_LOGGING
  }

  private formatMessage(message: string): string {
    return `[${this.context}] ${message}`
  }

  log(...args: LogArgs): void {
    if (this.isEnabled && this.enabledLevels.includes('log')) {
      if (typeof args[0] === 'string') {
        console.log(this.formatMessage(args[0]), ...args.slice(1))
      } else {
        console.log(...args)
      }
    }
  }

  info(...args: LogArgs): void {
    if (this.isEnabled && this.enabledLevels.includes('info')) {
      if (typeof args[0] === 'string') {
        console.info(this.formatMessage(args[0]), ...args.slice(1))
      } else {
        console.info(...args)
      }
    }
  }

  warn(...args: LogArgs): void {
    if (this.isEnabled && this.enabledLevels.includes('warn')) {
      if (typeof args[0] === 'string') {
        console.warn(this.formatMessage(args[0]), ...args.slice(1))
      } else {
        console.warn(...args)
      }
    }
  }

  error(...args: LogArgs): void {
    if (this.isEnabled && this.enabledLevels.includes('error')) {
      if (typeof args[0] === 'string') {
        console.error(this.formatMessage(args[0]), ...args.slice(1))
      } else {
        console.error(...args)
      }
    }
  }

  debug(...args: LogArgs): void {
    if (this.isEnabled && this.enabledLevels.includes('debug')) {
      if (typeof args[0] === 'string') {
        console.debug(this.formatMessage(args[0]), ...args.slice(1))
      } else {
        console.debug(...args)
      }
    }
  }
}

// Create and export default logger instance
export const logger = new Logger()

// Allow creation of context-specific loggers
export function createLogger(context: string, options: Omit<LoggerOptions, 'context'> = {}): Logger {
  return new Logger({ ...options, context })
}

export default logger 