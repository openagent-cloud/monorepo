# Credential Store Logging System

This module provides a comprehensive logging system for the Credential Store service, designed to support detailed logging for production environments.

## Features

- **Structured JSON Logging**: All logs are formatted as structured JSON for easy parsing and analysis
- **Contextual Logging**: Each log includes context information like request IDs, service names, and operation details
- **Error Parsing**: Automatically extracts and formats error details, including HTTP response data
- **Sensitive Data Redaction**: Automatically redacts sensitive information like API keys and passwords
- **Multiple Log Levels**: Supports debug, info, warn, error, and verbose log levels
- **Environment-Aware**: Different log formats and destinations based on environment (development vs. production)
- **Request/Response Logging**: Detailed logging of HTTP requests and responses with timing information
- **Specialized Loggers**: Domain-specific loggers for tenant, credential, and proxy operations

## Components

### Core Components

- **LoggerService**: Main logger service that extends NestJS Logger with enhanced capabilities
- **LoggerModule**: NestJS module that configures Winston and provides logger services
- **GlobalExceptionFilter**: Catches and logs all unhandled exceptions
- **HttpLoggerMiddleware**: Logs HTTP requests and responses with detailed information
- **LoggingInterceptor**: Logs controller method execution with timing information
- **LogUtils**: Utility class for structured logging of common operations

### Specialized Loggers

- **TenantLoggerService**: Specialized logger for tenant operations and API key management
- **CredentialLoggerService**: Specialized logger for credential operations
- **ProxyLoggerService**: Specialized logger for proxy operations and token usage tracking

## Usage

### Basic Logging

```typescript
// Inject the LoggerService
constructor(private readonly logger: LoggerService) {
  this.logger.setContext('MyService');
}

// Log at different levels
this.logger.log('This is an info message');
this.logger.debug('This is a debug message');
this.logger.warn('This is a warning message');
this.logger.error('This is an error message', error.stack);
this.logger.verbose('This is a verbose message');

// Log with metadata
this.logger.log('Message with metadata', undefined, { userId: '123', action: 'login' });
```

### Using Specialized Loggers

```typescript
// Tenant operations
constructor(private readonly tenantLogger: TenantLoggerService) {}

this.tenantLogger.logTenantCreation(tenantId, name, apiKey);
this.tenantLogger.logApiKeyRegeneration(tenantId, oldKeyPrefix, newApiKey);

// Credential operations
constructor(private readonly credentialLogger: CredentialLoggerService) {}

this.credentialLogger.logCredentialCreation(credentialId, tenantId, service);
this.credentialLogger.logCredentialUsage(credentialId, tenantId, service, endpoint, requestId, tokensUsed);

// Proxy operations
constructor(private readonly proxyLogger: ProxyLoggerService) {}

this.proxyLogger.logProxyRequestStart(requestId, tenantId, service, endpoint, method);
this.proxyLogger.logProxyRequestComplete(requestId, tenantId, service, endpoint, method, statusCode, duration, tokensUsed);
```

### Using LogUtils for Structured Logging

```typescript
LogUtils.logDbOperation(
  this.logger,
  'create',
  'User',
  { name: 'John', email: 'john@example.com' },
  { id: 123, name: 'John', email: 'john@example.com' }
);

LogUtils.logApiCall(
  this.logger,
  'PaymentService',
  'processPayment',
  'POST',
  { amount: 100, currency: 'USD' },
  { success: true, transactionId: '123456' },
  null,
  250 // duration in ms
);
```

## Log Output

### Development Environment

In development, logs are formatted for human readability with colors:

```
[2025-05-18T10:15:30.123Z] INFO [Bootstrap]: Application is running on: http://0.0.0.0:5860
[2025-05-18T10:15:35.456Z] DEBUG [TenantService]: Tenant created succeeded
  Metadata: {
    "operation": "created",
    "tenantId": "t_123456",
    "data": {
      "name": "Example Corp",
      "apiKeyPrefix": "tnnt_..."
    }
  }
```

### Production Environment

In production, logs are formatted as JSON for machine parsing:

```json
{"level":"info","message":"Application is running on: http://0.0.0.0:5860","timestamp":"2025-05-18T10:15:30.123Z","context":"Bootstrap","service":"credential-store","version":"0.1.0"}
{"level":"debug","message":"Tenant created succeeded","timestamp":"2025-05-18T10:15:35.456Z","context":"TenantService","operation":"created","tenantId":"t_123456","data":{"name":"Example Corp","apiKeyPrefix":"tnnt_..."},"service":"credential-store","version":"0.1.0"}
```

## Configuration

The logging system is configured in `logger.module.ts` and uses environment variables to determine the behavior:

- `NODE_ENV`: Determines log format and destinations (development vs. production)
- Log files are stored in the `logs` directory:
  - `logs/combined.log`: All logs of level info and above
  - `logs/error.log`: Error logs only
