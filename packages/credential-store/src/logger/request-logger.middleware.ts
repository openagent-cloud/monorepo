import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('HttpMiddleware');
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Get original timestamp before processing
    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = req;
    
    // Log basic request info at verbose level
    this.logger.verbose(`Incoming request: ${method} ${originalUrl}`, undefined, {
      ip,
      userAgent: headers['user-agent'],
      requestId: headers['x-request-id'] || `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    });

    // Add response listener to log after response is sent
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;
      
      // Log the complete request with timing information
      this.logger.logRequest(req, res, responseTime);
      
      // Log detailed error information for failed requests
      if (statusCode >= 400) {
        const level = statusCode >= 500 ? 'error' : 'warn';
        const message = `Request failed: ${method} ${originalUrl} ${statusCode}`;
        
        // Pass metadata as a separate object
        const metadata = {
          statusCode,
          responseTime,
          ip,
          headers: {
            'user-agent': headers['user-agent'],
            'content-type': headers['content-type'],
            'x-request-id': headers['x-request-id'],
          },
        };
        
        if (level === 'error') {
          this.logger.error(message, undefined, undefined, metadata);
        } else {
          this.logger.warn(message, undefined, metadata);
        }
      }
    });

    next();
  }
}
