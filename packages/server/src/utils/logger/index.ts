// Re-export everything from the logger module
export { LoggerModule, setupLogsDirectory } from './logger.module';
export { LoggerService } from './logger.service';
export { GlobalExceptionFilter } from './global-exception.filter';
export { HttpLoggerMiddleware } from './http-logger.middleware';
export { LogUtils } from './log-utils';

// All logger functionality now consolidated in the main LoggerService

// Export the logger config function from the module
export { loggerConfig } from './logger.module';
