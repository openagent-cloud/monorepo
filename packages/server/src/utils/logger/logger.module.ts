import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import { LoggerService } from './logger.service'
import { ConfigService } from '../config/config.service'
import * as winston from 'winston'
import { WinstonModuleOptions } from 'nest-winston'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Ensures the logs directory exists for storing log files
 */
export function setupLogsDirectory(): void {
  const logsDir = path.join(process.cwd(), 'logs')

  if (!fs.existsSync(logsDir)) {
    try {
      fs.mkdirSync(logsDir, { recursive: true })
      console.log('Logs directory created successfully')
    } catch (error) {
      console.error('Failed to create logs directory:', error)
    }
  }
}

// Define the logger config function inline to avoid import issues
export const loggerConfig = (configService: ConfigService): WinstonModuleOptions => {
  // Determine if we're in production
  const isProduction = configService.nodeEnv === 'production'

  // Define transports based on environment
  const transports: winston.transport[] = [
    // Console transport - always enabled
    new winston.transports.Console({
      level: isProduction ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message, timestamp, context, ms, trace, ...meta }) => {
          // Check if this is an incoming request log (starts with the down arrow emoji)
          if (typeof message === 'string' && message.startsWith('⬇️ Incoming')) {
            // For incoming requests, just show the emoji and metadata
            return `[${timestamp}] ${level} [${context || 'Application'}]${ms ? ` ${ms}` : ''}: ⬇️ Incoming\n  📊 Metadata: ${JSON.stringify(meta)}`
          }

          // Normal log message
          let log = `[${timestamp}] ${level} [${context || 'Application'}]${ms ? ` ${ms}` : ''}: ${message}`

          // Add trace if present
          if (trace) {
            log += `\n  ${trace}`
          }

          // Add any additional metadata with emoji
          if (Object.keys(meta).length > 0) {
            log += `\n  📊 Metadata: ${JSON.stringify(meta)}`
          }

          return log
        })
      )
    })
  ]

  // Add file transports in production
  if (isProduction) {
    // Combined log file
    transports.push(
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        level: 'info'
      })
    )

    // Error log file
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        level: 'error'
      })
    )
  }

  return {
    transports,
    // Default meta for all logs
    defaultMeta: {}
  }
}

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => loggerConfig(configService)
    })
  ],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
