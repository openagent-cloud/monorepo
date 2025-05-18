import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LogUtils } from './log-utils';

/**
 * Specialized logger for credential operations
 * Provides structured logging for credential-related activities
 */
@Injectable()
export class CredentialLoggerService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('CredentialService');
  }

  /**
   * Log credential creation
   */
  logCredentialCreation(credentialId: string, tenantId: string, service: string): void {
    LogUtils.logCredentialOperation(
      this.logger,
      'created',
      credentialId,
      tenantId,
      service
    );
  }

  /**
   * Log credential retrieval
   */
  logCredentialRetrieval(credentialId: string, tenantId: string, service: string, found: boolean): void {
    if (found) {
      LogUtils.logCredentialOperation(
        this.logger,
        'retrieved',
        credentialId,
        tenantId,
        service
      );
    } else {
      const error = new Error(`Credential not found: ${credentialId}`);
      LogUtils.logCredentialOperation(
        this.logger,
        'retrieval_failed',
        credentialId,
        tenantId,
        service,
        error
      );
    }
  }

  /**
   * Log credential update
   */
  logCredentialUpdate(credentialId: string, tenantId: string, service: string): void {
    LogUtils.logCredentialOperation(
      this.logger,
      'updated',
      credentialId,
      tenantId,
      service
    );
  }

  /**
   * Log credential deletion
   */
  logCredentialDeletion(credentialId: string, tenantId: string, service: string): void {
    LogUtils.logCredentialOperation(
      this.logger,
      'deleted',
      credentialId,
      tenantId,
      service
    );
  }

  /**
   * Log credential usage in proxy request
   */
  logCredentialUsage(
    credentialId: string, 
    tenantId: string, 
    service: string, 
    endpoint: string,
    requestId: string,
    tokensUsed?: number
  ): void {
    this.logger.log(
      `Credential ${credentialId} used for ${service}/${endpoint}`,
      'ProxyService',
      {
        credentialId,
        tenantId,
        service,
        endpoint,
        requestId,
        tokensUsed,
        timestamp: new Date().toISOString()
      }
    );
  }

  /**
   * Log credential validation
   */
  logCredentialValidation(credentialId: string, tenantId: string, service: string, isValid: boolean): void {
    if (isValid) {
      this.logger.debug(
        `Credential ${credentialId} for ${service} validated successfully`,
        'CredentialValidation',
        {
          credentialId,
          tenantId,
          service,
          timestamp: new Date().toISOString()
        }
      );
    } else {
      this.logger.warn(
        `Credential ${credentialId} for ${service} validation failed`,
        'CredentialValidation',
        {
          credentialId,
          tenantId,
          service,
          timestamp: new Date().toISOString()
        }
      );
    }
  }

  /**
   * Log credential operation errors
   */
  logCredentialError(
    operation: string,
    credentialId: string,
    tenantId: string,
    service: string,
    error: Error
  ): void {
    LogUtils.logCredentialOperation(
      this.logger,
      operation,
      credentialId,
      tenantId,
      service,
      error
    );
  }
}
