import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from './logger.service';

/**
 * Interceptor for logging controller method execution and response times
 * Also handles error parsing and logging
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('LoggingInterceptor');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, params, query, headers } = req;
    const requestId = headers['x-request-id'];
    const controller = context.getClass().name;
    const handler = context.getHandler().name;
    
    // Log controller method execution
    this.logger.debug(
      `${controller}.${handler} executing...`,
      undefined,
      {
        requestId,
        method,
        url,
        controller,
        handler,
        params,
        query,
      }
    );

    const startTime = Date.now();
    
    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        
        // Log successful response with timing
        this.logger.debug(
          `${controller}.${handler} completed in ${responseTime}ms`,
          undefined,
          {
            requestId,
            responseTime,
            controller,
            handler,
            // Only log response data if it's not too large
            responseData: data && JSON.stringify(data).length < 1000 ? data : '[Response data too large]',
          }
        );
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        
        // Parse error message from various error formats
        let errorMessage = error.message || 'Unknown error';
        let statusCode = error.status || error.statusCode || 500;
        let errorData = {};
        
        // Extract data from various error formats
        if (error.response) {
          statusCode = error.response.status || statusCode;
          
          // Try to extract message from response
          if (typeof error.response.data === 'object') {
            errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            errorData = error.response.data;
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data || errorMessage;
          }
        }
        
        // Log the error with detailed context
        this.logger.error(
          `${controller}.${handler} failed after ${responseTime}ms: ${errorMessage}`,
          error.stack,
          undefined,
          {
            requestId,
            responseTime,
            controller,
            handler,
            statusCode,
            errorData,
            url,
            method,
          }
        );
        
        // Re-throw the error for the global exception filter to handle
        throw error;
      })
    );
  }
}
