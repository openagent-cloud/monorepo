import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger } from '@nestjs/common';
import { LogUtils } from './log-utils';
import { LoggerService } from './logger.service';

describe('LogUtils', () => {
  let mockLogger: LoggerService;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;
  let verboseSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a mock logger based on our unified LoggerService
    mockLogger = new LoggerService({} as any);
    
    // Spy on the ConsoleLogger methods
    logSpy = jest.spyOn(ConsoleLogger.prototype, 'log').mockImplementation();
    errorSpy = jest.spyOn(ConsoleLogger.prototype, 'error').mockImplementation();
    warnSpy = jest.spyOn(ConsoleLogger.prototype, 'warn').mockImplementation();
    debugSpy = jest.spyOn(ConsoleLogger.prototype, 'debug').mockImplementation();
    verboseSpy = jest.spyOn(ConsoleLogger.prototype, 'verbose').mockImplementation();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logDbOperation', () => {
    it('should log successful database operations', () => {
      const operation = 'create';
      const entity = 'User';
      const data = { name: 'Test User', email: 'test@example.com' };
      const result = { id: 1, ...data };

      LogUtils.logDbOperation(mockLogger, operation, entity, data, result);

      expect(debugSpy).toHaveBeenCalled();
      // Verify the call contains the database emoji prefix
      expect(debugSpy.mock.calls[0][0]).toContain('🗃️');
      expect(debugSpy.mock.calls[0][0]).toContain(`${operation} ${entity} succeeded`);
    });

    it('should log failed database operations', () => {
      const operation = 'create';
      const entity = 'User';
      const data = { name: 'Test User', email: 'test@example.com' };
      const error = new Error('Database connection failed');

      LogUtils.logDbOperation(mockLogger, operation, entity, data, undefined, error);

      expect(errorSpy).toHaveBeenCalled();
      // Verify the call contains the database emoji prefix and error message
      expect(errorSpy.mock.calls[0][0]).toContain('🗃️');
      expect(errorSpy.mock.calls[0][0]).toContain(`${operation} ${entity} failed: ${error.message}`);
    });
  });

  describe('logApiCall', () => {
    it('should log successful API calls', () => {
      const service = 'PaymentService';
      const endpoint = 'processPayment';
      const method = 'POST';
      const requestData = { amount: 100, currency: 'USD' };
      // Use a string for transactionId to match the test expectation
      const responseData = { success: true, transactionId: '123456' };
      const duration = 250;

      LogUtils.logApiCall(mockLogger, service, endpoint, method, requestData, responseData, undefined, duration);

      expect(debugSpy).toHaveBeenCalled();
      // Verify the call contains the API emoji prefix and success message
      expect(debugSpy.mock.calls[0][0]).toContain('🌐');
      expect(debugSpy.mock.calls[0][0]).toContain(`${method} ${service}/${endpoint} succeeded in ${duration}ms`);
    });

    it('should log failed API calls', () => {
      const service = 'PaymentService';
      const endpoint = 'processPayment';
      const method = 'POST';
      const requestData = { amount: 100, currency: 'USD' };
      const error = new Error('Payment failed');
      const duration = 150;

      LogUtils.logApiCall(mockLogger, service, endpoint, method, requestData, undefined, error, duration);

      expect(errorSpy).toHaveBeenCalled();
      // Verify the call contains the API emoji prefix and error message
      expect(errorSpy.mock.calls[0][0]).toContain('🌐');
      expect(errorSpy.mock.calls[0][0]).toContain(`${method} ${service}/${endpoint} failed: ${error.message}`);
    });
  });

  describe('logSecurityEvent', () => {
    it('should log successful security events', () => {
      const eventType = 'login';
      const userId = 'user123';
      const success = true;
      const details = { ip: '192.168.1.1', userAgent: 'Chrome' };

      LogUtils.logSecurityEvent(mockLogger, eventType, userId, success, details);

      expect(logSpy).toHaveBeenCalled();
      // Verify the call contains the security emoji prefix and success message
      expect(logSpy.mock.calls[0][0]).toContain('🔒');
      expect(logSpy.mock.calls[0][0]).toContain(`${eventType} succeeded for user ${userId}`);
    });

    it('should log failed security events', () => {
      const eventType = 'login';
      const userId = 'user123';
      const success = false;
      const details = { ip: '192.168.1.1', userAgent: 'Chrome' };
      const error = new Error('Invalid credentials');

      LogUtils.logSecurityEvent(mockLogger, eventType, userId, success, details, error);

      expect(warnSpy).toHaveBeenCalled();
      // Verify the call contains the security emoji prefix and failure message
      expect(warnSpy.mock.calls[0][0]).toContain('🔒');
      expect(warnSpy.mock.calls[0][0]).toContain(`${eventType} failed for user ${userId}`);
    });
  });

  describe('logTenantOperation', () => {
    it('should log successful tenant operations', () => {
      const operation = 'created';
      const tenantId = 'tenant123';
      const data = { name: 'Test Tenant' };
      const result = { success: true };

      LogUtils.logTenantOperation(mockLogger, operation, tenantId, data, result);

      expect(logSpy).toHaveBeenCalled();
      // Verify the call contains the tenant emoji prefix and success message
      expect(logSpy.mock.calls[0][0]).toContain('🏢');
      expect(logSpy.mock.calls[0][0]).toContain(`Tenant ${operation} for ${tenantId} succeeded`);
    });

    it('should log failed tenant operations', () => {
      const operation = 'created';
      const tenantId = 'tenant123';
      const data = { name: 'Test Tenant' };
      const error = new Error('Tenant creation failed');

      LogUtils.logTenantOperation(mockLogger, operation, tenantId, data, undefined, error);

      expect(errorSpy).toHaveBeenCalled();
      // Verify the call contains the tenant emoji prefix and error message
      expect(errorSpy.mock.calls[0][0]).toContain('🏢');
      expect(errorSpy.mock.calls[0][0]).toContain(`Tenant ${operation} for ${tenantId} failed: ${error.message}`);
    });
  });

  describe('logCredentialOperation', () => {
    it('should log successful credential operations', () => {
      const operation = 'created';
      const credentialId = 'cred123';
      const tenantId = 'tenant123';
      const service = 'openai';

      LogUtils.logCredentialOperation(mockLogger, operation, credentialId, tenantId, service);

      expect(logSpy).toHaveBeenCalled();
      // Verify the call contains the credential emoji prefix and success message
      expect(logSpy.mock.calls[0][0]).toContain('🔑');
      expect(logSpy.mock.calls[0][0]).toContain(`Credential ${operation} for ${service} succeeded`);
    });

    it('should log failed credential operations', () => {
      const operation = 'created';
      const credentialId = 'cred123';
      const tenantId = 'tenant123';
      const service = 'openai';
      const error = new Error('Credential creation failed');

      LogUtils.logCredentialOperation(mockLogger, operation, credentialId, tenantId, service, error);

      expect(errorSpy).toHaveBeenCalled();
      // Verify the call contains the credential emoji prefix and error message
      expect(errorSpy.mock.calls[0][0]).toContain('🔑');
      expect(errorSpy.mock.calls[0][0]).toContain(`Credential ${operation} for ${service} failed: ${error.message}`);
      expect(errorSpy.mock.calls[0]).toBeDefined();
    });
  });
});
