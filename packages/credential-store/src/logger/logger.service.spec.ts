import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as winston from 'winston';

describe('LoggerService', () => {
  let service: LoggerService;
  let mockLogger: any;

  beforeEach(async () => {
    // Create a mock Winston logger
    mockLogger = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = await module.resolve(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set context correctly', () => {
    const context = 'TestContext';
    const result = service.setContext(context);
    
    expect(result).toBe(service); // Should return this for chaining
    expect((service as any).context).toBe(context); // Access private property for testing
  });

  it('should log messages at info level', () => {
    const message = 'Test log message';
    const context = 'TestContext';
    
    service.log(message, context);
    
    expect(mockLogger.log).toHaveBeenCalledWith(
      'info',
      message,
      expect.objectContaining({ context })
    );
  });

  it('should log error messages with trace', () => {
    const message = 'Test error message';
    const trace = 'Error stack trace';
    const context = 'TestContext';
    
    service.error(message, trace, context);
    
    expect(mockLogger.log).toHaveBeenCalledWith(
      'error',
      message,
      expect.objectContaining({ 
        context,
        trace
      })
    );
  });

  it('should handle Error objects passed directly', () => {
    const errorObj = new Error('Test error');
    errorObj.stack = 'Mock stack trace';
    
    service.error(errorObj);
    
    expect(mockLogger.log).toHaveBeenCalledWith(
      'error',
      'Test error',
      expect.objectContaining({
        error: errorObj,
        trace: errorObj.stack
      })
    );
  });

  it('should log warnings correctly', () => {
    const message = 'Test warning';
    const context = 'TestContext';
    
    service.warn(message, context);
    
    expect(mockLogger.log).toHaveBeenCalledWith(
      'warn',
      message,
      expect.objectContaining({ context })
    );
  });

  it('should log debug messages correctly', () => {
    const message = 'Test debug message';
    const context = 'TestContext';
    
    service.debug(message, context);
    
    expect(mockLogger.log).toHaveBeenCalledWith(
      'debug',
      message,
      expect.objectContaining({ context })
    );
  });

  it('should log verbose messages correctly', () => {
    const message = 'Test verbose message';
    const context = 'TestContext';
    
    service.verbose(message, context);
    
    expect(mockLogger.log).toHaveBeenCalledWith(
      'verbose',
      message,
      expect.objectContaining({ context })
    );
  });

  it('should log HTTP requests with detailed information', () => {
    const req = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'test-agent',
        'content-type': 'application/json'
      },
      body: { test: 'data' }
    };
    
    const res = {
      statusCode: 200,
      get: jest.fn().mockReturnValue('100'),
    };
    
    const responseTime = 150;
    
    service.logRequest(req, res, responseTime);
    
    expect(mockLogger.log).toHaveBeenCalledWith(
      'info',
      `HTTP GET /test 200 150ms`,
      expect.objectContaining({
        context: 'HttpRequest',
        request: expect.any(Object),
        response: expect.any(Object)
      })
    );
  });

  it('should log API errors with message extraction', () => {
    const error = {
      message: 'API Error',
      status: 400,
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          errors: ['Field is required']
        }
      },
      stack: 'Error stack trace'
    };
    
    const req = {
      originalUrl: '/test',
      method: 'POST',
      headers: {
        'x-request-id': '12345'
      }
    };
    
    service.logApiError(error, req);
    
    expect(mockLogger.log).toHaveBeenCalledWith(
      'error',
      'Validation failed',
      expect.objectContaining({
        context: 'ApiError',
        statusCode: 400,
        path: '/test',
        method: 'POST',
        requestId: '12345'
      })
    );
  });
});
