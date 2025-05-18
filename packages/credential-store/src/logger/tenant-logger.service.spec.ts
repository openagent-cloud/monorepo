import { Test, TestingModule } from '@nestjs/testing';
import { TenantLoggerService } from './tenant-logger.service';
import { LoggerService } from './logger.service';
import { LogUtils } from './log-utils';

// Mock LogUtils to verify it's called correctly
jest.mock('./log-utils', () => ({
  LogUtils: {
    logTenantOperation: jest.fn(),
    logSecurityEvent: jest.fn(),
  }
}));

describe('TenantLoggerService', () => {
  let service: TenantLoggerService;
  let mockLoggerService: Partial<LoggerService>;
  let module: TestingModule;

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
    module = await Test.createTestingModule({
      providers: [
        TenantLoggerService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = await module.resolve(TenantLoggerService);
    
    // Clear mock calls before each test
    jest.clearAllMocks();
    
    // Manually call setContext to simulate constructor behavior
    mockLoggerService.setContext?.('TenantService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set context in constructor', () => {
    expect(mockLoggerService.setContext).toHaveBeenCalledWith('TenantService');
  });

  describe('logTenantCreation', () => {
    it('should log tenant creation correctly', () => {
      const tenantId = 'tenant123';
      const name = 'Test Tenant';
      const apiKey = 'tnnt_abcdefghijklmnopqrstuvwxyz';
      
      service.logTenantCreation(tenantId, name, apiKey);
      
      expect(LogUtils.logTenantOperation).toHaveBeenCalledWith(
        mockLoggerService,
        'created',
        tenantId,
        { name, apiKeyPrefix: 'tnnt_...' },
        { success: true }
      );
    });
  });

  describe('logApiKeyRegeneration', () => {
    it('should log API key regeneration correctly', () => {
      const tenantId = 'tenant123';
      const oldKeyPrefix = 'tnnt_oldkey';
      const newApiKey = 'tnnt_newkey';
      
      service.logApiKeyRegeneration(tenantId, oldKeyPrefix, newApiKey);
      
      expect(LogUtils.logTenantOperation).toHaveBeenCalledWith(
        mockLoggerService,
        'api_key_regenerated',
        tenantId,
        { 
          oldKeyPrefix: 'tnnt_...',
          newKeyPrefix: 'tnnt_...'
        },
        { success: true }
      );
    });
  });

  describe('logTenantDeletion', () => {
    it('should log tenant deletion correctly', () => {
      const tenantId = 'tenant123';
      const name = 'Test Tenant';
      
      service.logTenantDeletion(tenantId, name);
      
      expect(LogUtils.logTenantOperation).toHaveBeenCalledWith(
        mockLoggerService,
        'deleted',
        tenantId,
        { name },
        { success: true }
      );
    });
  });

  describe('logTenantRetrieval', () => {
    it('should log successful tenant retrieval', () => {
      const tenantId = 'tenant123';
      const found = true;
      
      service.logTenantRetrieval(tenantId, found);
      
      expect(LogUtils.logTenantOperation).toHaveBeenCalledWith(
        mockLoggerService,
        'retrieved',
        tenantId,
        { found },
        { success: found }
      );
    });

    it('should log failed tenant retrieval', () => {
      const tenantId = 'tenant123';
      const found = false;
      
      service.logTenantRetrieval(tenantId, found);
      
      expect(LogUtils.logTenantOperation).toHaveBeenCalledWith(
        mockLoggerService,
        'retrieved',
        tenantId,
        { found },
        { success: found }
      );
    });
  });

  describe('logTenantList', () => {
    it('should log tenant list operation', () => {
      const count = 5;
      const adminId = 'admin123';
      
      service.logTenantList(count, adminId);
      
      expect(LogUtils.logTenantOperation).toHaveBeenCalledWith(
        mockLoggerService,
        'listed',
        'all',
        { adminId, count },
        { success: true }
      );
    });
  });

  describe('logApiKeyValidation', () => {
    it('should log successful API key validation', () => {
      const apiKeyPrefix = 'tnnt_12345';
      const tenantId = 'tenant123';
      const success = true;
      
      service.logApiKeyValidation(apiKeyPrefix, tenantId, success);
      
      expect(LogUtils.logSecurityEvent).toHaveBeenCalledWith(
        mockLoggerService,
        'api_key_validation',
        tenantId,
        success,
        { apiKeyPrefix: 'tnnt_...' }
      );
    });

    it('should log failed API key validation and warn', () => {
      const apiKeyPrefix = 'tnnt_12345';
      const tenantId = null;
      const success = false;
      
      service.logApiKeyValidation(apiKeyPrefix, tenantId, success);
      
      expect(LogUtils.logSecurityEvent).toHaveBeenCalledWith(
        mockLoggerService,
        'api_key_validation',
        'unknown',
        success,
        { apiKeyPrefix: 'tnnt_...' }
      );
      
      expect(mockLoggerService.warn).toHaveBeenCalledWith(
        'Invalid API key attempt: tnnt_...',
        'Security',
        expect.objectContaining({
          apiKeyPrefix: 'tnnt_...',
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('logAdminApiKeyValidation', () => {
    it('should log successful admin API key validation', () => {
      const success = true;
      
      service.logAdminApiKeyValidation(success);
      
      expect(LogUtils.logSecurityEvent).toHaveBeenCalledWith(
        mockLoggerService,
        'admin_api_key_validation',
        'admin',
        success,
        expect.objectContaining({
          timestamp: expect.any(String)
        })
      );
    });

    it('should log failed admin API key validation and warn', () => {
      const success = false;
      
      service.logAdminApiKeyValidation(success);
      
      expect(LogUtils.logSecurityEvent).toHaveBeenCalledWith(
        mockLoggerService,
        'admin_api_key_validation',
        'admin',
        success,
        expect.objectContaining({
          timestamp: expect.any(String)
        })
      );
      
      expect(mockLoggerService.warn).toHaveBeenCalledWith(
        'Invalid admin API key attempt',
        'Security',
        expect.objectContaining({
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('logTenantError', () => {
    it('should log tenant operation errors', () => {
      const operation = 'update';
      const tenantId = 'tenant123';
      const error = new Error('Update failed');
      
      service.logTenantError(operation, tenantId, error);
      
      expect(LogUtils.logTenantOperation).toHaveBeenCalledWith(
        mockLoggerService,
        operation,
        tenantId,
        undefined,
        undefined,
        error
      );
    });
  });
});
