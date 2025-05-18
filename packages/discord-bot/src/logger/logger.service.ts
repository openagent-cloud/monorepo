import { Injectable, LoggerService as NestLoggerService, Scope, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// Define interfaces for HTTP errors and request objects to avoid TypeScript errors
interface HttpError extends Error {
  response?: {
    status?: number;
    data?: any;
  };
}

interface RequestWithBody {
  method: string;
  originalUrl: string;
  ip?: string;
  headers: Record<string, any>;
  body?: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Set the context for this logger instance
   */
  setContext(context: string): this {
    this.context = context;
    return this;
  }

  /**
   * Log a message at the 'log' level
   */
  log(message: any, context?: string, ...meta: any[]): void {
    this.callLogMethod('info', message, context, meta);
  }

  /**
   * Log a message at the 'error' level
   */
  error(message: any, trace?: string, context?: string, ...meta: any[]): void {
    // Handle case where an Error object is passed directly
    if (message instanceof Error) {
      const { message: msg, name, stack, ...rest } = message;
      this.callLogMethod('error', msg, context, [
        { error: message, trace: trace || stack, ...rest, ...this.extractMetadata(meta) },
      ]);
    } else {
      this.callLogMethod('error', message, context, [
        { trace, ...this.extractMetadata(meta) },
      ]);
    }
  }

  /**
   * Log a message at the 'warn' level
   */
  warn(message: any, context?: string, ...meta: any[]): void {
    this.callLogMethod('warn', message, context, meta);
  }

  /**
   * Log a message at the 'debug' level
   */
  debug(message: any, context?: string, ...meta: any[]): void {
    this.callLogMethod('debug', message, context, meta);
  }

  /**
   * Log a message at the 'verbose' level
   */
  verbose(message: any, context?: string, ...meta: any[]): void {
    this.callLogMethod('verbose', message, context, meta);
  }

  /**
   * Log HTTP requests with detailed information
   */
  logRequest(req: any, res: any, responseTime: number): void {
    const { method, originalUrl, ip, headers, body } = req;
    const userAgent = headers['user-agent'];
    const contentLength = res.get('content-length') || 0;
    const statusCode = res.statusCode;
    
    // Determine log level based on status code
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    
    this.logger.log(level, `HTTP ${method} ${originalUrl} ${statusCode} ${responseTime}ms`, {
      context: 'HttpRequest',
      request: {
        method,
        url: originalUrl,
        ip,
        userAgent,
        // Only log body for non-GET requests and if not too large
        body: method !== 'GET' && body && JSON.stringify(body).length < 1000 ? body : undefined,
      },
      response: {
        statusCode,
        contentLength,
        responseTime,
      },
    });
  }

  /**
   * Log detailed API errors with message extraction
   */
  logApiError(error: any, req?: any): void {
    const context = 'ApiError';
    let statusCode = error.status || error.statusCode || 500;
    let message = error.message || 'Unknown error';
    let errorData = {};
    
    // Extract data from various error formats
    if (error.response) {
      // Axios or similar HTTP client error
      statusCode = error.response.status || statusCode;
      
      // Try to extract message from response
      if (typeof error.response.data === 'object') {
        message = error.response.data.message || error.response.data.error || message;
        errorData = error.response.data;
      } else if (typeof error.response.data === 'string') {
        message = error.response.data || message;
      }
    }
    
    // Log the error with all available context
    this.error(message, error.stack, context, {
      statusCode,
      path: req?.originalUrl,
      method: req?.method,
      errorData,
      // Include request ID if available
      requestId: req?.headers['x-request-id'],
    });
  }

  /**
   * Utility method to extract metadata from args
   */
  private extractMetadata(args: any[]): Record<string, any> {
    if (args.length === 0) return {};
    
    // If the first item is an object, use it as metadata
    if (typeof args[0] === 'object' && args[0] !== null) {
      return args[0];
    }
    
    // Otherwise, return an empty object
    return {};
  }

  /**
   * Call the appropriate log method with context
   */
  private callLogMethod(
    level: 'info' | 'error' | 'warn' | 'debug' | 'verbose',
    message: any,
    context?: string,
    meta: any[] = [],
  ): void {
    const contextToUse = context || this.context;
    
    // Handle objects and errors specially
    if (typeof message === 'object' && message !== null) {
      if (!(message instanceof Error)) {
        // For objects that aren't errors, stringify them
        message = JSON.stringify(message);
      }
    }

    this.logger.log(level, message, {
      context: contextToUse,
      ...this.extractMetadata(meta),
    });
  }
}
