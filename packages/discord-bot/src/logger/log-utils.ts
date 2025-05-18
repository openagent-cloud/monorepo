import { LoggerService } from './logger.service';

/**
 * Utility class for structured logging throughout the application
 * Provides consistent logging patterns for common scenarios
 */
export class LogUtils {
  /**
   * Log a database operation with detailed information
   */
  static logDbOperation(
    logger: LoggerService,
    operation: string,
    entity: string,
    data: any,
    result?: any,
    error?: Error
  ): void {
    const context = 'Database';
    const message = `${operation} ${entity}`;
    
    if (error) {
      logger.error(
        `${message} failed: ${error.message}`,
        error.stack,
        context,
        {
          operation,
          entity,
          data: this.sanitizeData(data),
          error: this.formatError(error),
        }
      );
    } else {
      logger.debug(
        `${message} succeeded`,
        context,
        {
          operation,
          entity,
          data: this.sanitizeData(data),
          result: result ? this.sanitizeData(result) : undefined,
        }
      );
    }
  }

  /**
   * Log an API call to an external service
   */
  static logApiCall(
    logger: LoggerService,
    service: string,
    endpoint: string,
    method: string,
    requestData?: any,
    responseData?: any,
    error?: Error,
    duration?: number
  ): void {
    const context = 'ExternalApi';
    const message = `${method} ${service}/${endpoint}`;
    
    const metadata = {
      service,
      endpoint,
      method,
      requestData: requestData ? this.sanitizeData(requestData) : undefined,
      duration,
    };
    
    if (error) {
      logger.error(
        `${message} failed: ${error.message}`,
        error.stack,
        context,
        {
          ...metadata,
          error: this.formatError(error),
        }
      );
    } else {
      logger.debug(
        `${message} succeeded${duration ? ` in ${duration}ms` : ''}`,
        context,
        {
          ...metadata,
          responseData: responseData ? this.sanitizeData(responseData) : undefined,
        }
      );
    }
  }

  /**
   * Log a security event (authentication, authorization, etc.)
   */
  static logSecurityEvent(
    logger: LoggerService,
    eventType: string,
    userId: string,
    success: boolean,
    details?: any,
    error?: Error
  ): void {
    const context = 'Security';
    const status = success ? 'succeeded' : 'failed';
    const message = `${eventType} ${status} for user ${userId}`;
    
    const logMethod = success ? 'log' : 'warn';
    
    logger[logMethod](
      message,
      context,
      {
        eventType,
        userId,
        success,
        details: details ? this.sanitizeData(details) : undefined,
        error: error ? this.formatError(error) : undefined,
      }
    );
  }

  /**
   * Log a tenant management operation
   */
  static logTenantOperation(
    logger: LoggerService,
    operation: string,
    tenantId: string,
    data?: any,
    result?: any,
    error?: Error
  ): void {
    const context = 'TenantManagement';
    const message = `Tenant ${operation} for ${tenantId}`;
    
    if (error) {
      logger.error(
        `${message} failed: ${error.message}`,
        error.stack,
        context,
        {
          operation,
          tenantId,
          data: data ? this.sanitizeData(data) : undefined,
          error: this.formatError(error),
        }
      );
    } else {
      logger.log(
        `${message} succeeded`,
        context,
        {
          operation,
          tenantId,
          data: data ? this.sanitizeData(data) : undefined,
          result: result ? this.sanitizeData(result) : undefined,
        }
      );
    }
  }

  /**
   * Log a credential operation
   */
  static logCredentialOperation(
    logger: LoggerService,
    operation: string,
    credentialId: string,
    tenantId: string,
    service: string,
    error?: Error
  ): void {
    const context = 'CredentialManagement';
    const message = `Credential ${operation} for ${service}`;
    
    if (error) {
      logger.error(
        `${message} failed: ${error.message}`,
        error.stack,
        context,
        {
          operation,
          credentialId,
          tenantId,
          service,
          error: this.formatError(error),
        }
      );
    } else {
      logger.log(
        `${message} succeeded`,
        context,
        {
          operation,
          credentialId,
          tenantId,
          service,
        }
      );
    }
  }

  /**
   * Format an error object for logging
   */
  private static formatError(error: Error): any {
    const formattedError: any = {
      message: error.message,
      name: error.name,
    };
    
    // Add stack trace if available
    if (error.stack) {
      formattedError.stack = error.stack;
    }
    
    // Handle HTTP errors with response data
    const httpError = error as any;
    if (httpError.response) {
      formattedError.status = httpError.response.status;
      formattedError.statusText = httpError.response.statusText;
      
      // Extract response data if available
      if (httpError.response.data) {
        formattedError.responseData = typeof httpError.response.data === 'object'
          ? JSON.stringify(httpError.response.data)
          : httpError.response.data;
      }
    }
    
    return formattedError;
  }

  /**
   * Sanitize sensitive data for logging
   * Removes or masks sensitive fields like passwords, tokens, etc.
   */
  private static sanitizeData(data: any): any {
    if (!data) return data;
    
    // For strings, check if it's a JSON string and parse it
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return this.sanitizeData(parsed);
      } catch (e) {
        return data; // Not JSON, return as is
      }
    }
    
    // For arrays, sanitize each item
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }
    
    // For objects, sanitize each property
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      
      for (const [key, value] of Object.entries(data)) {
        // Check if this is a sensitive field that should be masked
        if (this.isSensitiveField(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      
      return sanitized;
    }
    
    // For other types, return as is
    return data;
  }

  /**
   * Check if a field name indicates sensitive data
   */
  private static isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'apiKey',
      'api_key',
      'auth',
      'credential',
      'jwt',
      'authorization',
    ];
    
    return sensitiveFields.some(field => 
      fieldName.toLowerCase().includes(field.toLowerCase())
    );
  }
}
