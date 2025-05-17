// Import environment utilities
import './src/env'
export * from './src/env'

// Type definitions for database models
export interface User {
  id: number
  email: string
  name: string
  username: string
  role: 'admin' | 'super_admin' | 'user'
  avatarUrl?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Token {
  id: number
  token: string
  tokenHash: string
  type: 'access' | 'email_verification' | 'password_reset' | 'refresh' | 'siwe'
  userId: number
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

// Enum types that mirror the Prisma enums
export enum user_role {
  admin = "admin",
  super_admin = "super_admin",
  user = "user"
}

export enum token_type {
  access = "access",
  email_verification = "email_verification",
  password_reset = "password_reset",
  refresh = "refresh",
  siwe = "siwe"
}

// Try to import Prisma client if it's been generated
let prismaImport: any

try {
  // This will throw an error if Prisma hasn't been generated yet
  prismaImport = require('./generated/prisma')
} catch (e) {
  console.warn('Prisma client not found. Run `npm run db:generate` in the shared package first.')

  // Create a mock PrismaClient if not available yet
  prismaImport = {
    PrismaClient: class MockPrismaClient {
      constructor() {
        console.warn('Using mock Prisma client. Database operations will fail.')
      }
    }
  }
}

// Export the PrismaClient class for use by consumers
export const { PrismaClient } = prismaImport

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: typeof PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient()

// Use our environment utility to check for development mode
import { env } from './src/env'
if (env.IS_DEVELOPMENT) {
  global.prisma = prisma
}

// Re-export everything from Prisma
try {
  Object.assign(exports, prismaImport)
} catch (e) {
  console.warn('Failed to export Prisma types')
}

// Don't fail if Prisma types aren't generated yet
// This export will be replaced with the real one when Prisma is generated
// export * from './generated/prisma' 