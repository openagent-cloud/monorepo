import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to log HTTP requests and responses with detailed information
 * Adds request ID tracking and performance metrics
 */
@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('HttpLogger');
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Generate or use existing request ID
    const requestId = req.headers['x-request-id'] as string || `req-${uuidv4()}`;
    req.headers['x-request-id'] = requestId;
    
    // Get request start time
    const startTime = process.hrtime();
    
    // Log the incoming request with detailed info
    this.logger.log(`Incoming ${req.method} ${req.originalUrl}`, undefined, {
      requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      contentType: req.headers['content-type'],
      // Only include body for non-GET requests and if not too large
      body: req.method !== 'GET' && req.body && JSON.stringify(req.body).length < 1000 
        ? req.body 
        : undefined,
    });

    // Capture the original end method
    const originalEnd = res.end;
    
    // Override the end method to log response details
    res.end = function(this: Response, ...args: any[]) {
      // Calculate request duration
      const hrTime = process.hrtime(startTime);
      const responseTime = hrTime[0] * 1000 + hrTime[1] / 1000000; // Convert to ms
      
      // Add response time header
      res.setHeader('X-Response-Time', `${responseTime.toFixed(2)}ms`);
      
      // Ensure request ID is in response headers
      res.setHeader('X-Request-ID', requestId);
      
      // Get status code
      const statusCode = res.statusCode;
      
      // Determine log level based on status code
      let logLevel: 'log' | 'warn' | 'error' = 'log';
      if (statusCode >= 500) {
        logLevel = 'error';
      } else if (statusCode >= 400) {
        logLevel = 'warn';
      }
      
      // Log the response
      const logger = (this as any).req.app.get('logger') as LoggerService;
      if (logger) {
        const message = `${req.method} ${req.originalUrl} ${statusCode} ${responseTime.toFixed(2)}ms`;
        const metadata = {
          requestId,
          method: req.method,
          url: req.originalUrl,
          statusCode,
          responseTime: parseFloat(responseTime.toFixed(2)),
          contentLength: res.getHeader('content-length'),
          contentType: res.getHeader('content-type'),
        };
        
        if (logLevel === 'error') {
          logger.error(message, undefined, undefined, metadata);
        } else if (logLevel === 'warn') {
          logger.warn(message, undefined, metadata);
        } else {
          logger.log(message, undefined, metadata);
        }
      }
      
      // Call the original end method
      return originalEnd.apply(this, args);
    };
    
    next();
  }
}
