import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LogUtils } from './log-utils';

/**
 * Specialized logger for proxy operations
 * Provides structured logging for external API calls and token usage
 */
@Injectable()
export class ProxyLoggerService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('ProxyService');
  }

  /**
   * Log the start of a proxy request
   */
  logProxyRequestStart(
    requestId: string,
    tenantId: string,
    service: string,
    endpoint: string,
    method: string
  ): void {
    this.logger.log(
      `Starting proxy request to ${service}/${endpoint}`,
      'ProxyRequest',
      {
        requestId,
        tenantId,
        service,
        endpoint,
        method,
        timestamp: new Date().toISOString(),
        status: 'started'
      }
    );
  }

  /**
   * Log the completion of a proxy request
   */
  logProxyRequestComplete(
    requestId: string,
    tenantId: string,
    service: string,
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number,
    tokensUsed?: number
  ): void {
    this.logger.log(
      `Completed proxy request to ${service}/${endpoint} with status ${statusCode} in ${duration}ms`,
      'ProxyRequest',
      {
        requestId,
        tenantId,
        service,
        endpoint,
        method,
        statusCode,
        duration,
        tokensUsed,
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
    );
  }

  /**
   * Log a failed proxy request
   */
  logProxyRequestFailure(
    requestId: string,
    tenantId: string,
    service: string,
    endpoint: string,
    method: string,
    error: Error,
    duration: number
  ): void {
    LogUtils.logApiCall(
      this.logger,
      service,
      endpoint,
      method,
      { requestId, tenantId },
      undefined,
      error,
      duration
    );

    this.logger.error(
      `Failed proxy request to ${service}/${endpoint}: ${error.message}`,
      error.stack,
      'ProxyRequest',
      {
        requestId,
        tenantId,
        service,
        endpoint,
        method,
        duration,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: LogUtils['formatError'](error) // Accessing private method
      }
    );
  }

  /**
   * Log token usage for a proxy request
   */
  logTokenUsage(
    requestId: string,
    tenantId: string,
    service: string,
    endpoint: string,
    promptTokens: number,
    completionTokens: number,
    totalTokens: number,
    cost?: number
  ): void {
    this.logger.log(
      `Token usage for ${service}/${endpoint}: ${totalTokens} tokens (${promptTokens} prompt, ${completionTokens} completion)`,
      'TokenUsage',
      {
        requestId,
        tenantId,
        service,
        endpoint,
        promptTokens,
        completionTokens,
        totalTokens,
        cost,
        timestamp: new Date().toISOString()
      }
    );
  }

  /**
   * Log rate limiting events
   */
  logRateLimiting(
    requestId: string,
    tenantId: string,
    service: string,
    endpoint: string,
    limitType: string,
    retryAfter?: number
  ): void {
    this.logger.warn(
      `Rate limit hit for ${service}/${endpoint}: ${limitType}`,
      'RateLimit',
      {
        requestId,
        tenantId,
        service,
        endpoint,
        limitType,
        retryAfter,
        timestamp: new Date().toISOString()
      }
    );
  }

  /**
   * Log API key rotation events
   */
  logApiKeyRotation(
    service: string,
    reason: string
  ): void {
    this.logger.log(
      `API key rotation for ${service}: ${reason}`,
      'KeyRotation',
      {
        service,
        reason,
        timestamp: new Date().toISOString()
      }
    );
  }
}
