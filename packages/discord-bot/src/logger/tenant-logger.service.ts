import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LogUtils } from './log-utils';

/**
 * Specialized logger for tenant operations and API key management
 * Provides structured logging for tenant-related activities
 */
@Injectable()
export class TenantLoggerService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('TenantService');
  }

  /**
   * Log tenant creation
   */
  logTenantCreation(tenantId: string, name: string, apiKey: string): void {
    LogUtils.logTenantOperation(
      this.logger,
      'created',
      tenantId,
      { name, apiKeyPrefix: apiKey.substring(0, 5) + '...' },
      { success: true }
    );
  }

  /**
   * Log tenant API key regeneration
   */
  logApiKeyRegeneration(tenantId: string, oldKeyPrefix: string, newApiKey: string): void {
    LogUtils.logTenantOperation(
      this.logger,
      'api_key_regenerated',
      tenantId,
      { 
        oldKeyPrefix: oldKeyPrefix.substring(0, 5) + '...',
        newKeyPrefix: newApiKey.substring(0, 5) + '...'
      },
      { success: true }
    );
  }

  /**
   * Log tenant deletion
   */
  logTenantDeletion(tenantId: string, name: string): void {
    LogUtils.logTenantOperation(
      this.logger,
      'deleted',
      tenantId,
      { name },
      { success: true }
    );
  }

  /**
   * Log tenant retrieval
   */
  logTenantRetrieval(tenantId: string, found: boolean): void {
    LogUtils.logTenantOperation(
      this.logger,
      'retrieved',
      tenantId,
      { found },
      { success: found }
    );
  }

  /**
   * Log tenant list operation
   */
  logTenantList(count: number, adminId: string): void {
    LogUtils.logTenantOperation(
      this.logger,
      'listed',
      'all',
      { adminId, count },
      { success: true }
    );
  }

  /**
   * Log API key validation
   */
  logApiKeyValidation(apiKeyPrefix: string, tenantId: string | null, success: boolean): void {
    const maskedKey = apiKeyPrefix.substring(0, 5) + '...';
    
    LogUtils.logSecurityEvent(
      this.logger,
      'api_key_validation',
      tenantId || 'unknown',
      success,
      { apiKeyPrefix: maskedKey }
    );
    
    if (!success) {
      this.logger.warn(`Invalid API key attempt: ${maskedKey}`, 'Security', {
        apiKeyPrefix: maskedKey,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Log admin API key validation
   */
  logAdminApiKeyValidation(success: boolean): void {
    LogUtils.logSecurityEvent(
      this.logger,
      'admin_api_key_validation',
      'admin',
      success,
      { timestamp: new Date().toISOString() }
    );
    
    if (!success) {
      this.logger.warn('Invalid admin API key attempt', 'Security', {
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Log tenant operation errors
   */
  logTenantError(operation: string, tenantId: string, error: Error): void {
    LogUtils.logTenantOperation(
      this.logger,
      operation,
      tenantId,
      undefined,
      undefined,
      error
    );
  }
}
