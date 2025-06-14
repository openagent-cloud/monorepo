import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('ExceptionFilter');
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    
    // Determine status code and error message
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // Extract the error message
    let message = 'Internal server error';
    let errorResponse: any = { message, statusCode: status };
    
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorResponse = { message, statusCode: status };
      } else if (typeof exceptionResponse === 'object') {
        errorResponse = exceptionResponse;
        message = errorResponse.message || 'Error occurred';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorResponse = { message, statusCode: status };
    }
    
    // Log the error with detailed information
    this.logger.logApiError(exception, request);
    
    // Send the error response
    response.status(status).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
