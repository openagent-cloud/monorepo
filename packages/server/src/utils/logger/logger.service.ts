import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common'
import { ConfigService } from '../config/config.service'

/**
 * Interface for structured request metadata
 */
export interface RequestMetadata {
  method: string
  url: string
  statusCode?: number
  ip?: string
  userAgent?: string
  requestId?: string
  contentLength?: number
  responseTime?: number
  body?: any
}

/**
 * Interface for credential operation metadata
 */
export interface CredentialMetadata {
  credentialId: string
  tenantId: string
  service: string
  operation?: string
  timestamp?: string
}

/**
 * Interface for proxy request metadata
 */
export interface ProxyMetadata {
  requestId: string
  tenantId: string
  service: string
  endpoint: string
  method?: string
  statusCode?: number
  duration?: number
  timestamp?: string
  tokensUsed?: number
}

/**
 * A unified logger service that extends NestJS ConsoleLogger
 * with consistent formatting, emoji indicators, and structured metadata
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  // Emoji mapping for different log levels
  private static readonly EMOJI_MAP = {
    log: '✅', // Green checkmark for standard logs
    error: '❌', // Red cross for errors
    warn: '⚠️', // Warning symbol for warnings
    debug: '🔍', // Magnifying glass for debug
    verbose: '🔊', // Speaker high volume for verbose logs
    // HTTP specific
    httpIncoming: '⬇️', // Arrow coming in for requests
    httpOutgoing: '⬆️' // Arrow going out for responses
  }

  // Service metadata
  private readonly defaultMetadata: Record<string, unknown>
  private readonly enabledLevels: LogLevel[]

  constructor(
    private readonly configService: ConfigService,
    context?: string
  ) {
    // Pass context to NestJS ConsoleLogger (providing empty string if undefined)
    super(context || '')

    // Initialize service metadata
    this.defaultMetadata = {
      service: 'credential-store',
      version: process.env.npm_package_version || 'dev'
    }

    // Set log levels based on environment
    const nodeEnv = this.configService.nodeEnv
    this.enabledLevels =
      nodeEnv === 'production'
        ? ['log', 'error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose']

    // Set enabled log levels in the console logger
    this.setLogLevels(this.enabledLevels)
  }

  /**
   * Log an informational message with emoji
   * @param message The message to log
   * @param context Context (source of the log), use '' for no context
   * @param metadata Optional metadata to include
   */
  log(message: any, context: string = this.context || '', metadata?: Record<string, any>): void {
    const enhancedMessage = this.addEmoji('log', message)
    super.log(enhancedMessage, context || '', this.addMetadata(metadata))
  }

  /**
   * Log an error with emoji
   * @param message The error message
   * @param trace Optional error stack trace
   * @param context Context (source of the log), use '' for no context
   * @param metadata Optional metadata to include
   */
  error(message: any, trace: string = '', context: string = this.context || '', metadata?: Record<string, any>): void {
    const enhancedMessage = this.addEmoji('error', message)
    super.error(enhancedMessage, trace, context || '', this.addMetadata(metadata))
  }

  /**
   * Log a warning with emoji
   * @param message The warning message
   * @param context Context (source of the log), use '' for no context
   * @param metadata Optional metadata to include
   */
  warn(message: any, context: string = this.context || '', metadata?: Record<string, any>): void {
    const enhancedMessage = this.addEmoji('warn', message)
    super.warn(enhancedMessage, context || '', this.addMetadata(metadata))
  }

  /**
   * Log a debug message with emoji
   * @param message The debug message
   * @param context Context (source of the log), use '' for no context
   * @param metadata Optional metadata to include
   */
  debug(message: any, context: string = this.context || '', metadata?: Record<string, any>): void {
    const enhancedMessage = this.addEmoji('debug', message)
    super.debug(enhancedMessage, context || '', this.addMetadata(metadata))
  }

  /**
   * Log a verbose message with emoji
   * @param message The verbose message
   * @param context Context (source of the log), use '' for no context
   * @param metadata Optional metadata to include
   */
  verbose(message: any, context: string = this.context || '', metadata?: Record<string, any>): void {
    const enhancedMessage = this.addEmoji('verbose', message)
    super.verbose(enhancedMessage, context || '', this.addMetadata(metadata))
  }

  /**
   * Log incoming HTTP request
   * @param metadata Request metadata with details
   */
  httpIncoming(metadata: RequestMetadata): void {
    const message = `Incoming ${metadata.method} ${metadata.url}`
    this.log(this.addEmoji('httpIncoming', message), 'HttpRequest', metadata)
  }

  /**
   * Log outgoing HTTP response
   * @param metadata Response metadata with details
   */
  httpOutgoing(metadata: RequestMetadata): void {
    const { statusCode = 200, method, url, responseTime } = metadata
    const message = `Outgoing ${method} ${url} ${statusCode} ${responseTime}ms`

    // Select log level based on status code
    if (statusCode >= 500) {
      this.error(this.addEmoji('httpOutgoing', message), '', 'HttpResponse', metadata)
    } else if (statusCode >= 400) {
      this.warn(this.addEmoji('httpOutgoing', message), 'HttpResponse', metadata)
    } else {
      this.log(this.addEmoji('httpOutgoing', message), 'HttpResponse', metadata)
    }
  }

  /**
   * Log an API error with detailed info
   * @param error The error object
   * @param metadata Additional metadata
   */
  apiError(error: Error | any, metadata?: Record<string, any>): void {
    let statusCode = 500
    let errorMessage = error?.message || 'Unknown error'
    let errorData: Record<string, any> = {}

    // Handle HTTP error responses
    if (error?.response) {
      statusCode = error.response.status || statusCode

      if (typeof error.response.data === 'object') {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage
        errorData = error.response.data
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data || errorMessage
      }
    }

    // Combine all metadata
    const combinedMetadata = {
      ...metadata,
      statusCode,
      errorData
    }

    this.error(errorMessage, error?.stack, 'ApiError', combinedMetadata)
  }

  /**
   * Add emoji prefix to a message based on the log level
   * @param level The log level
   * @param message The message to enhance
   * @returns The enhanced message with emoji
   */
  private addEmoji(level: string, message: any): any {
    if (typeof message !== 'string') {
      return message
    }

    const emoji = LoggerService.EMOJI_MAP[level] || ''
    return `${emoji} ${message}`
  }

  /**
   * Combine default metadata with provided metadata
   * @param metadata Additional metadata to include
   * @returns Combined metadata object
   */
  /**
   * Add default metadata to custom metadata
   * Only returns a value if there's actual metadata to add to prevent undefined log lines
   * @param metadata Custom metadata to merge with defaults
   */
  private addMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    // If no metadata and defaultMetadata is empty, return undefined to prevent extra log lines
    if (!metadata && Object.keys(this.defaultMetadata).length === 0) {
      return undefined;
    }
    
    return {
      ...this.defaultMetadata,
      ...metadata,
    };
  }

  /* ========================== BACKWARDS COMPATIBILITY METHODS ========================== */
  
  /**
   * Log HTTP requests with detailed information (legacy method for test compatibility)
   * @deprecated Use httpIncoming and httpOutgoing instead
   */
  logRequest(req: any, res: any, responseTime: number): void {
    const { method, originalUrl, ip, headers, body } = req;
    const userAgent = headers['user-agent'];
    const contentLength = res.get('content-length') || 0;
    const statusCode = res.statusCode;
    
    // Use the new httpOutgoing method internally
    this.httpOutgoing({
      method,
      url: originalUrl,
      statusCode,
      ip,
      userAgent,
      responseTime,
      contentLength: parseInt(contentLength, 10),
      body: method !== 'GET' && body && JSON.stringify(body).length < 1000 ? body : undefined,
    });
  }
  
  /**
   * Log detailed API errors with message extraction (legacy method for test compatibility)
   * @deprecated Use apiError instead
   */
  logApiError(error: any, req?: any): void {
    // Call the new apiError method internally
    this.apiError(error, {
      path: req?.originalUrl,
      method: req?.method,
      requestId: req?.headers?.['x-request-id'],
    });
  }

  /* ========================== CREDENTIAL LOGGING METHODS ========================== */

  /**
   * Log credential operation with consistent format
   * @param operation Operation performed on credential (created, updated, etc)
   * @param metadata Credential metadata
   */
  logCredential(operation: string, metadata: CredentialMetadata): void {
    const { credentialId, service } = metadata;
    const timestamp = new Date().toISOString();

    this.log(
      `🔑 Credential ${operation}: ${credentialId} (${service})`,
      'CredentialService',
      {
        ...metadata,
        operation,
        timestamp,
      }
    );
  }

  /**
   * Log credential error
   * @param operation Failed operation
   * @param metadata Credential metadata
   * @param error The error that occurred
   */
  logCredentialError(operation: string, metadata: CredentialMetadata, error: Error): void {
    const { credentialId, service } = metadata;
    const timestamp = new Date().toISOString();

    this.error(
      `🔑 Credential ${operation} failed: ${credentialId} (${service})`,
      error.stack,
      'CredentialService',
      {
        ...metadata,
        operation,
        timestamp,
        errorMessage: error.message,
      }
    );
  }

  /**
   * Log credential validation
   * @param isValid Whether validation succeeded
   * @param metadata Credential metadata
   */
  logCredentialValidation(isValid: boolean, metadata: CredentialMetadata): void {
    const { credentialId, service } = metadata;
    const timestamp = new Date().toISOString();
    const operation = isValid ? 'validated' : 'validation_failed';

    if (isValid) {
      this.debug(
        `🔑 Credential validated: ${credentialId} (${service})`,
        'CredentialValidation',
        {
          ...metadata,
          operation,
          timestamp,
        }
      );
    } else {
      this.warn(
        `🔑 Credential validation failed: ${credentialId} (${service})`,
        'CredentialValidation',
        {
          ...metadata,
          operation,
          timestamp,
        }
      );
    }
  }

  /* ========================== PROXY LOGGING METHODS ========================== */

  /**
   * Log proxy request initiation
   * @param metadata Proxy request metadata
   */
  logProxyStart(metadata: ProxyMetadata): void {
    const { service, endpoint } = metadata;
    const timestamp = new Date().toISOString();

    this.log(
      `🌐 Starting proxy request: ${service}/${endpoint}`,
      'ProxyService',
      {
        ...metadata,
        timestamp,
        status: 'started',
      }
    );
  }

  /**
   * Log successful proxy request completion
   * @param metadata Proxy request metadata with response details
   */
  logProxyComplete(metadata: ProxyMetadata): void {
    const { service, endpoint, statusCode = 200, duration = 0 } = metadata;
    const timestamp = new Date().toISOString();

    this.log(
      `🌐 Completed proxy request: ${service}/${endpoint} (${statusCode}, ${duration}ms)`,
      'ProxyService',
      {
        ...metadata,
        timestamp,
        status: 'completed',
      }
    );
  }

  /**
   * Log failed proxy request
   * @param metadata Proxy request metadata
   * @param error The error that occurred
   */
  logProxyFailure(metadata: ProxyMetadata, error: Error): void {
    const { service, endpoint, duration = 0 } = metadata;
    const timestamp = new Date().toISOString();

    this.error(
      `🌐 Failed proxy request: ${service}/${endpoint} (${error.message})`,
      error.stack,
      'ProxyService',
      {
        ...metadata,
        errorMessage: error.message,
        timestamp,
        status: 'failed',
      }
    );
  }

  /**
   * Log token usage for proxy request
   * @param metadata Proxy metadata
   * @param promptTokens Number of tokens used in prompt
   * @param completionTokens Number of tokens used in completion
   * @param totalTokens Total tokens used
   * @param cost Optional cost of request
   */
  logTokenUsage(
    metadata: ProxyMetadata,
    promptTokens: number,
    completionTokens: number,
    totalTokens: number,
    cost?: number
  ): void {
    const { service, endpoint } = metadata;
    const timestamp = new Date().toISOString();

    this.log(
      `📊 Token usage: ${service}/${endpoint} - ${totalTokens} tokens`,
      'TokenUsage',
      {
        ...metadata,
        promptTokens,
        completionTokens,
        totalTokens,
        cost,
        timestamp,
      }
    );
  }

  /**
   * Log rate limiting event
   * @param metadata Proxy metadata
   * @param limitType Type of rate limit hit
   * @param retryAfter Optional retry delay in seconds
   */
  logRateLimit(metadata: ProxyMetadata, limitType: string, retryAfter?: number): void {
    const { service, endpoint } = metadata;
    const timestamp = new Date().toISOString();

    this.warn(
      `⏱️ Rate limit hit: ${service}/${endpoint} - ${limitType}`,
      'RateLimit',
      {
        ...metadata,
        limitType,
        retryAfter,
        timestamp,
      }
    );
  }
}
