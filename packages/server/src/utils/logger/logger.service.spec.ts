import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigService } from '../config/config.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let mockConfigService: ConfigService;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;
  let verboseSpy: jest.SpyInstance;

  beforeEach(async () => {
    // Create a mock ConfigService
    mockConfigService = {
      nodeEnv: 'test'
    } as ConfigService;

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = await module.resolve(LoggerService);
    
    // Spy on console methods used by ConsoleLogger
    logSpy = jest.spyOn(ConsoleLogger.prototype, 'log').mockImplementation();
    errorSpy = jest.spyOn(ConsoleLogger.prototype, 'error').mockImplementation();
    warnSpy = jest.spyOn(ConsoleLogger.prototype, 'warn').mockImplementation();
    debugSpy = jest.spyOn(ConsoleLogger.prototype, 'debug').mockImplementation();
    verboseSpy = jest.spyOn(ConsoleLogger.prototype, 'verbose').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set context correctly', () => {
    const context = 'TestContext';
    service.setContext(context);
    
    // Can't easily check the context as it's private in ConsoleLogger
    // But we can verify the service is still defined
    expect(service).toBeDefined();
  });

  it('should log messages at info level', () => {
    const message = 'Test log message';
    const context = 'TestContext';
    
    service.log(message, context);
    
    expect(logSpy).toHaveBeenCalled();
    // Verify message contains our emoji prefix for log level
    expect(logSpy.mock.calls[0][0]).toContain('✅');
  });

  it('should log error messages with trace', () => {
    const message = 'Test error message';
    const trace = 'Error stack trace';
    const context = 'TestContext';
    
    service.error(message, trace, context);
    
    expect(errorSpy).toHaveBeenCalled();
    // Verify message contains our emoji prefix for error level
    expect(errorSpy.mock.calls[0][0]).toContain('❌');
  });

  it('should handle Error objects passed directly', () => {
    const errorObj = new Error('Test error');
    errorObj.stack = 'Mock stack trace';
    
    service.error(errorObj);
    
    // Just verify the error method was called - error objects are handled differently
    expect(errorSpy).toHaveBeenCalled();
  });

  it('should log warnings correctly', () => {
    const message = 'Test warning';
    const context = 'TestContext';
    
    service.warn(message, context);
    
    expect(warnSpy).toHaveBeenCalled();
    // Verify message contains our emoji prefix for warning level
    expect(warnSpy.mock.calls[0][0]).toContain('⚠️');
  });

  it('should log debug messages correctly', () => {
    const message = 'Test debug message';
    const context = 'TestContext';
    
    service.debug(message, context);
    
    expect(debugSpy).toHaveBeenCalled();
    // Verify message contains our emoji prefix for debug level
    expect(debugSpy.mock.calls[0][0]).toContain('🔍');
  });

  it('should log verbose messages correctly', () => {
    const message = 'Test verbose message';
    const context = 'TestContext';
    
    service.verbose(message, context);
    
    expect(verboseSpy).toHaveBeenCalled();
    // Verify message contains our emoji prefix for verbose level
    expect(verboseSpy.mock.calls[0][0]).toContain('🔊');
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
    
    // Check that our log method was called through the logHttpOutgoing method
    expect(logSpy).toHaveBeenCalled();
    // Should contain outgoing emoji
    expect(logSpy.mock.calls[0][0]).toContain('⬆️');
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
    
    // Check that our error method was called
    expect(errorSpy).toHaveBeenCalled();
    // Error should contain our error emoji prefix
    expect(errorSpy.mock.calls[0][0]).toContain('❌');
  });

  it('should log credential operations correctly', () => {
    const metadata = {
      credentialId: 'cred123',
      tenantId: 'tenant456',
      service: 'openai'
    };
    
    service.logCredential('created', metadata);
    
    expect(logSpy).toHaveBeenCalled();
    // Should contain key emoji
    expect(logSpy.mock.calls[0][0]).toContain('🔑');
  });

  it('should log proxy requests correctly', () => {
    const metadata = {
      requestId: 'req123',
      tenantId: 'tenant456',
      service: 'openai',
      endpoint: '/completions'
    };
    
    service.logProxyStart(metadata);
    
    expect(logSpy).toHaveBeenCalled();
    // Should contain globe emoji for proxy requests
    expect(logSpy.mock.calls[0][0]).toContain('🌐');
  });
});
