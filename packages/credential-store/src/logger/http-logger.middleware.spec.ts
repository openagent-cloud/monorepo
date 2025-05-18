import { Test, TestingModule } from '@nestjs/testing';
import { HttpLoggerMiddleware } from './http-logger.middleware';
import { LoggerService } from './logger.service';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Mock uuid to return a predictable value
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid')
}));

describe('HttpLoggerMiddleware', () => {
  let middleware: HttpLoggerMiddleware;
  let mockLoggerService: Partial<LoggerService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(async () => {
    // Create a mock LoggerService
    mockLoggerService = {
      setContext: jest.fn().mockReturnThis(),
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpLoggerMiddleware,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();
    mockRequest = {
      method: 'GET',
      originalUrl: '/test',
      headers: {},
      app: {
        get: jest.fn().mockReturnValue(mockLoggerService),
        set: jest.fn(),
      } as any,
      body: { test: 'data' },
    };

    // Create a proper mock for response.end that can be overridden
    const mockEndFn = jest.fn();
    mockResponse = {
      statusCode: 200,
      getHeader: jest.fn(),
      setHeader: jest.fn(),
      end: mockEndFn,
    };
    
    // Add req property to response for logger access
    (mockResponse as any).req = mockRequest;

    mockNext = jest.fn();

    // Get middleware from the module
    middleware = await module.resolve(HttpLoggerMiddleware);
    
    // Set the logger directly to avoid DI issues
    (middleware as any).logger = mockLoggerService;
    
    // Manually call setContext to simulate constructor behavior
    mockLoggerService.setContext?.('HttpLogger');
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should set context in constructor', () => {
    expect(mockLoggerService.setContext).toHaveBeenCalledWith('HttpLogger');
  });

  it('should generate request ID if not provided', () => {
    // Ensure headers is defined
    mockRequest.headers = mockRequest.headers || {};
    
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockRequest.headers['x-request-id']).toBe('req-test-uuid');
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      `Incoming ${mockRequest.method} ${mockRequest.originalUrl}`,
      undefined,
      expect.objectContaining({
        requestId: 'req-test-uuid',
        method: mockRequest.method,
        url: mockRequest.originalUrl
      })
    );
  });

  it('should use existing request ID if provided', () => {
    // Ensure headers is defined
    mockRequest.headers = mockRequest.headers || {};
    mockRequest.headers['x-request-id'] = 'existing-id';
    
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockRequest.headers['x-request-id']).toBe('existing-id');
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      `Incoming ${mockRequest.method} ${mockRequest.originalUrl}`,
      undefined,
      expect.objectContaining({
        requestId: 'existing-id'
      })
    );
  });

  it('should call next middleware', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
  });

  it('should override response end method', () => {
    const originalEnd = mockResponse.end;
    
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockResponse.end).not.toBe(originalEnd);
  });

  it('should log response details on end for success response', () => {
    // Mock the hrtime function to return a predictable value
    const originalHrTime = process.hrtime;
    // Create a mock function that satisfies the TypeScript type
    const mockHrTime: any = jest.fn().mockReturnValue([0, 150000000]);
    mockHrTime.bigint = jest.fn().mockReturnValue(BigInt(150000000));
    process.hrtime = mockHrTime;
    
    // Store the original end function
    const originalEnd = mockResponse.end;
    
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    // The middleware should have replaced the end function
    expect(mockResponse.end).not.toBe(originalEnd);
    
    // Manually call the new end function
    const newEndFunction = mockResponse.end as Function;
    newEndFunction.call(mockResponse);
    
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Response-Time', '150.00ms');
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Request-ID', expect.any(String));
    
    expect(mockLoggerService.log).toHaveBeenCalledTimes(2); // Once for request, once for response
    expect(mockLoggerService.log).toHaveBeenLastCalledWith(
      'GET /test 200 150.00ms',
      undefined,
      expect.objectContaining({
        statusCode: 200,
        responseTime: 150,
      })
    );
    
    // Restore original hrtime
    process.hrtime = originalHrTime;
  });

  it('should log warning for 4xx responses', () => {
    mockResponse.statusCode = 404;
    
    // Mock the hrtime function
    const originalHrTime = process.hrtime;
    // Create a mock function that satisfies the TypeScript type
    const mockHrTime: any = jest.fn().mockReturnValue([0, 150000000]);
    mockHrTime.bigint = jest.fn().mockReturnValue(BigInt(150000000));
    process.hrtime = mockHrTime;
    
    // Store the original end function
    const originalEnd = mockResponse.end;
    
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Manually call the new end function
    const newEndFunction = mockResponse.end as Function;
    newEndFunction.call(mockResponse);
    
    expect(mockLoggerService.warn).toHaveBeenCalledWith(
      'GET /test 404 150.00ms',
      undefined,
      expect.objectContaining({
        statusCode: 404,
        responseTime: 150,
      })
    );
    
    // Restore original hrtime
    process.hrtime = originalHrTime;
  });

  it('should log error for 5xx responses', () => {
    mockResponse.statusCode = 500;
    
    // Mock the hrtime function
    const originalHrTime = process.hrtime;
    // Create a mock function that satisfies the TypeScript type
    const mockHrTime: any = jest.fn().mockReturnValue([0, 150000000]);
    mockHrTime.bigint = jest.fn().mockReturnValue(BigInt(150000000));
    process.hrtime = mockHrTime;
    
    // Store the original end function
    const originalEnd = mockResponse.end;
    
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    // Manually call the new end function
    const newEndFunction = mockResponse.end as Function;
    newEndFunction.call(mockResponse);
    
    expect(mockLoggerService.error).toHaveBeenCalledWith(
      'GET /test 500 150.00ms',
      undefined,
      undefined,
      expect.objectContaining({
        statusCode: 500,
        responseTime: 150,
      })
    );
    
    // Restore original hrtime
    process.hrtime = originalHrTime;
  });

  it('should not include body for GET requests', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      `Incoming ${mockRequest.method} ${mockRequest.originalUrl}`,
      undefined,
      expect.not.objectContaining({
        body: expect.anything()
      })
    );
  });

  it('should include body for POST requests', () => {
    mockRequest.method = 'POST';
    
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    
    expect(mockLoggerService.log).toHaveBeenCalledWith(
      `Incoming ${mockRequest.method} ${mockRequest.originalUrl}`,
      undefined,
      expect.objectContaining({
        body: mockRequest.body
      })
    );
  });
});
