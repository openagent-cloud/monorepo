import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigService } from '../config/config.service';
import { LoggerService } from './logger.service';
import { TenantLoggerService } from './tenant-logger.service';
import { CredentialLoggerService } from './credential-logger.service';
import { ProxyLoggerService } from './proxy-logger.service';
import * as winston from 'winston';
import { WinstonModuleOptions } from 'nest-winston';

// Define the logger config function inline to avoid import issues
export const loggerConfig = (configService: ConfigService): WinstonModuleOptions => {
  // Determine if we're in production
  const isProduction = configService.nodeEnv === 'production';
  
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
          // Build the log message
          let log = `[${timestamp}] ${level} [${context || 'Application'}]${ms ? ` ${ms}` : ''}: ${message}`;
          
          // Add trace if present
          if (trace) {
            log += `\n  ${trace}`;
          }
          
          // Add any additional metadata
          if (Object.keys(meta).length > 0) {
            log += `\n  Metadata: ${JSON.stringify(meta, null, 2)}`;
          }
          
          return log;
        })
      ),
    }),
  ];
  
  // Add file transports in production
  if (isProduction) {
    // Combined log file
    transports.push(
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        level: 'info',
      })
    );
    
    // Error log file
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
        level: 'error',
      })
    );
  }
  
  return {
    transports,
    // Default meta for all logs
    defaultMeta: {
      service: 'credential-store',
      version: process.env.npm_package_version || '0.0.0',
    },
  };
};

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => loggerConfig(configService),
    }),
  ],
  providers: [
    LoggerService,
    TenantLoggerService,
    CredentialLoggerService,
    ProxyLoggerService
  ],
  exports: [
    LoggerService,
    TenantLoggerService,
    CredentialLoggerService,
    ProxyLoggerService
  ],
})
export class LoggerModule {}
