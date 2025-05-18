import { z } from 'zod';

/**
 * Environment schema validation using Zod
 * This ensures all required environment variables are set before the app starts
 */
export const envSchema = z.object({
  // Database Configuration
  POSTGRES_DB: z.string().min(1, 'POSTGRES_DB is required'),
  POSTGRES_USER: z.string().min(1, 'POSTGRES_USER is required'),
  POSTGRES_PASSWORD: z.string().min(1, 'POSTGRES_PASSWORD is required'),
  POSTGRES_PORT: z.string().regex(/^\d+$/, 'POSTGRES_PORT must be a number').transform(Number),
  
  // Connection URLs
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  INTERNAL_DATABASE_URL: z.string().url('INTERNAL_DATABASE_URL must be a valid URL'),
  
  // Application Configuration
  SERVER_PORT: z.string().regex(/^\d+$/, 'SERVER_PORT must be a number').transform(Number),
  CRED_ENCRYPT_KEY: z.string().min(64, 'CRED_ENCRYPT_KEY must be at least 64 characters long'),
  ADMIN_API_KEY: z.string().min(16, 'ADMIN_API_KEY must be at least 16 characters long'),
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    errorMap: () => ({ message: 'NODE_ENV must be one of: development, production, test' }),
  }),
});

/**
 * Validated environment variables
 * This type provides type safety for environment variables throughout the application
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables against the schema
 * Throws an error if any required variables are missing or invalid
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => {
        return `${err.path.join('.')}: ${err.message}`;
      });
      
      console.error('\n❌ Invalid environment variables:');
      console.error(errorMessages.map(msg => `  - ${msg}`).join('\n'));
      console.error('\nPlease check your .env file and make sure all required variables are set correctly.\n');
    } else {
      console.error('\n❌ Unknown error validating environment variables:', error);
    }
    
    process.exit(1);
  }
}
