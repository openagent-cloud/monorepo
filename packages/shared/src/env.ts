import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Utility function to find the .env file in parent directories
function findEnvFile(startPath: string): string | null {
  let currentPath = startPath

  // Maximum number of directories to go up
  const maxDepth = 5
  let depth = 0

  while (depth < maxDepth) {
    const envPath = path.join(currentPath, '.env')

    if (fs.existsSync(envPath)) {
      return envPath
    }

    // Go up one directory
    const parentPath = path.dirname(currentPath)

    // If we've reached the root directory, stop
    if (parentPath === currentPath) {
      break
    }

    currentPath = parentPath
    depth++
  }

  return null
}

/**
 * Load environment variables from .env file
 * 
 * This function tries to find and load a .env file in the current directory
 * or any parent directory up to a certain depth.
 */
export function loadEnv(): void {
  // Try to find .env file starting from the directory of this file
  const envFile = findEnvFile(__dirname)

  if (envFile) {
    dotenv.config({ path: envFile })
    console.log(`Environment loaded from: ${envFile}`)
  } else {
    console.warn('No .env file found. Using process.env as is.')
  }
}

/**
 * Get a required environment variable
 * 
 * @param key - The name of the environment variable
 * @param defaultValue - Optional default value to use if the variable is not set
 * @returns The value of the environment variable
 * @throws Error if the variable is not set and no default value is provided
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`)
  }

  return value
}

/**
 * Get an optional environment variable
 * 
 * @param key - The name of the environment variable
 * @param defaultValue - Default value to use if the variable is not set
 * @returns The value of the environment variable or the default value
 */
export function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue
}

// Export environment variables with type checking
export const env = {
  // Database
  DATABASE_URL: getEnv('DATABASE_URL'),

  // Admin User (used for seeding)
  SUPER_ADMIN_EMAIL: getOptionalEnv('SUPER_ADMIN_EMAIL', 'admin@example.com'),
  SUPER_ADMIN_USERNAME: getOptionalEnv('SUPER_ADMIN_USERNAME', 'admin'),
  SUPER_ADMIN_NAME: getOptionalEnv('SUPER_ADMIN_NAME', 'Admin User'),
  SUPER_ADMIN_PASSWORD: getOptionalEnv('SUPER_ADMIN_PASSWORD', 'securePassword123!'),

  // App Settings
  APP_NAME: getOptionalEnv('APP_NAME', 'Electric Stack App'),
  APP_DESCRIPTION: getOptionalEnv('APP_DESCRIPTION', 'An application built with the Electric Stack'),

  // Environment
  NODE_ENV: getOptionalEnv('NODE_ENV', 'development'),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV !== 'production',
}

// Load environment variables when this module is imported
loadEnv() 