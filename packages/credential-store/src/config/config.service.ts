import { Injectable, OnModuleInit } from '@nestjs/common'
import { Env, validateEnv } from './env.schema'

/**
 * Configuration service that provides access to validated environment variables
 * Uses Zod for validation to ensure all required variables are set
 */
@Injectable()
export class ConfigService implements OnModuleInit {
  private readonly env: Env;
  
  constructor() {
    // Validate environment variables on service instantiation
    this.env = validateEnv();
  }
  
  /**
   * Validate environment variables when the module initializes
   * This ensures the application won't start with missing or invalid environment variables
   */
  onModuleInit() {
    console.log('✅ Environment variables validated successfully');
  }

  /**
   * Get the encryption key for credentials
   */
  get encryptionKey(): Buffer {
    return Buffer.from(this.env.CRED_ENCRYPT_KEY, 'hex');
  }

  /**
   * Get the database URL
   */
  get databaseUrl(): string {
    return this.env.DATABASE_URL;
  }

  /**
   * Get the internal database URL (for container-to-container communication)
   */
  get internalDatabaseUrl(): string {
    return this.env.INTERNAL_DATABASE_URL;
  }

  /**
   * Get the port to listen on
   */
  get port(): number {
    return this.env.SERVER_PORT;
  }
  
  /**
   * Get the current environment (development, production, test)
   */
  get nodeEnv(): string {
    return this.env.NODE_ENV;
  }
  
  /**
   * Check if the application is running in production
   */
  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }
  
  /**
   * Check if the application is running in development
   */
  get isDevelopment(): boolean {
    return this.env.NODE_ENV === 'development';
  }
  
  /**
   * Check if the application is running in test mode
   */
  get isTest(): boolean {
    return this.env.NODE_ENV === 'test';
  }

  /**
   * Get the admin API key for tenant management
   */
  get adminApiKey(): string {
    return this.env.ADMIN_API_KEY;
  }
}
