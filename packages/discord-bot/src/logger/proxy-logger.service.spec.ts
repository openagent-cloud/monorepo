import { Test, TestingModule } from '@nestjs/testing';
import { ProxyLoggerService } from './proxy-logger.service';
import { LoggerService } from './logger.service';
import { LogUtils } from './log-utils';

// Mock LogUtils to verify it's called correctly
jest.mock('./log-utils', () => ({
  LogUtils: {
    logApiCall: jest.fn(),
    formatError: jest.fn(error => ({
      message: error.message,
      name: error.name,
      stack: error.stack
    }))
  }
}));

describe('ProxyLoggerService', () => {
  let service: ProxyLoggerService;
  let mockLoggerService: Partial<LoggerService>;

  beforeEach(async () => {
    // Create mocks
    mockLoggerService = {
      setContext: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProxyLoggerService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = await module.resolve(ProxyLoggerService);
    
    // Clear mock calls before each test
    jest.clearAllMocks();
    
    // Manually call setContext to simulate constructor behavior
    mockLoggerService.setContext?.('ProxyService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set context in constructor', () => {
    expect(mockLoggerService.setContext).toHaveBeenCalledWith('ProxyService');
  });

  describe('logProxyRequestStart', () => {
    it('should log the start of a proxy request', () => {
      const requestId = 'req-123';
      const tenantId = 'tenant-456';
      const serviceName = 'openai';
      const endpoint = '/v1/chat/completions';
      const method = 'POST';
      
      service.logProxyRequestStart(requestId, tenantId, serviceName, endpoint, method);
      
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        `Starting proxy request to ${serviceName}/${endpoint}`,
        'ProxyRequest',
        expect.objectContaining({
          requestId,
          tenantId,
          service: serviceName,
          endpoint,
          method,
          status: 'started',
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('logProxyRequestComplete', () => {
    it('should log the completion of a proxy request', () => {
      const requestId = 'req-123';
      const tenantId = 'tenant-456';
      const serviceName = 'openai';
      const endpoint = '/v1/chat/completions';
      const method = 'POST';
      const statusCode = 200;
      const duration = 1250;
      const tokensUsed = 350;
      
      service.logProxyRequestComplete(
        requestId, tenantId, serviceName, endpoint, method, statusCode, duration, tokensUsed
      );
      
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        `Completed proxy request to ${serviceName}/${endpoint} with status ${statusCode} in ${duration}ms`,
        'ProxyRequest',
        expect.objectContaining({
          requestId,
          tenantId,
          service: serviceName,
          endpoint,
          method,
          statusCode,
          duration,
          tokensUsed,
          status: 'completed',
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('logProxyRequestFailure', () => {
    it('should log a failed proxy request', () => {
      const requestId = 'req-123';
      const tenantId = 'tenant-456';
      const serviceName = 'openai';
      const endpoint = '/v1/chat/completions';
      const method = 'POST';
      const error = new Error('API request failed');
      const duration = 850;
      
      service.logProxyRequestFailure(
        requestId, tenantId, serviceName, endpoint, method, error, duration
      );
      
      // Should call LogUtils.logApiCall
      expect(LogUtils.logApiCall).toHaveBeenCalledWith(
        mockLoggerService,
        serviceName,
        endpoint,
        method,
        { requestId, tenantId },
        undefined,
        error,
        duration
      );
      
      // Should also log directly with error details
      expect(mockLoggerService.error).toHaveBeenCalledWith(
        `Failed proxy request to ${serviceName}/${endpoint}: ${error.message}`,
        error.stack,
        'ProxyRequest',
        expect.objectContaining({
          requestId,
          tenantId,
          service: serviceName,
          endpoint,
          method,
          duration,
          status: 'failed',
          error: expect.any(Object),
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('logTokenUsage', () => {
    it('should log token usage details', () => {
      const requestId = 'req-123';
      const tenantId = 'tenant-456';
      const serviceName = 'openai';
      const endpoint = '/v1/chat/completions';
      const promptTokens = 150;
      const completionTokens = 200;
      const totalTokens = 350;
      const cost = 0.0075;
      
      service.logTokenUsage(
        requestId, tenantId, serviceName, endpoint, 
        promptTokens, completionTokens, totalTokens, cost
      );
      
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        `Token usage for ${serviceName}/${endpoint}: ${totalTokens} tokens (${promptTokens} prompt, ${completionTokens} completion)`,
        'TokenUsage',
        expect.objectContaining({
          requestId,
          tenantId,
          service: serviceName,
          endpoint,
          promptTokens,
          completionTokens,
          totalTokens,
          cost,
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('logRateLimiting', () => {
    it('should log rate limiting events', () => {
      const requestId = 'req-123';
      const tenantId = 'tenant-456';
      const serviceName = 'openai';
      const endpoint = '/v1/chat/completions';
      const limitType = 'tokens_per_minute';
      const retryAfter = 30;
      
      service.logRateLimiting(
        requestId, tenantId, serviceName, endpoint, limitType, retryAfter
      );
      
      expect(mockLoggerService.warn).toHaveBeenCalledWith(
        `Rate limit hit for ${serviceName}/${endpoint}: ${limitType}`,
        'RateLimit',
        expect.objectContaining({
          requestId,
          tenantId,
          service: serviceName,
          endpoint,
          limitType,
          retryAfter,
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('logApiKeyRotation', () => {
    it('should log API key rotation events', () => {
      const serviceName = 'openai';
      const reason = 'monthly rotation';
      
      service.logApiKeyRotation(serviceName, reason);
      
      expect(mockLoggerService.log).toHaveBeenCalledWith(
        `API key rotation for ${serviceName}: ${reason}`,
        'KeyRotation',
        expect.objectContaining({
          service: serviceName,
          reason,
          timestamp: expect.any(String)
        })
      );
    });
  });
});
