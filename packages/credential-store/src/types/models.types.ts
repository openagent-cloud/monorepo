import { AdapterType } from "@prisma/client"

/**
 * Tenant model interface
 */
export interface Tenant {
  id: string
  name: string
  apiKey: string
  createdAt: Date
}

/**
 * Credential model interface
 */
export interface Credential {
  id: string
  tenantId: string
  service: AdapterType
  encryptedKey: string
  meta: Record<string, any>
  createdAt: Date
}

/**
 * ProxyRequest model interface
 */
export interface ProxyRequest {
  id: string
  tenantId: string
  service: AdapterType
  endpoint: string
  status: number
  responseMs: number
  createdAt: Date
}

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  iv: string
  encrypted: string
  authTag: string
}

/**
 * Usage statistics interface
 */
export interface UsageStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  avgResponseTime: number
  totalTokens: number
  promptTokens: number
  completionTokens: number
  models: string[]
  byService: Record<string, ServiceStats>
}

/**
 * Service statistics interface
 */
export interface ServiceStats {
  total: number
  successful: number
  avgResponseTime: number
  totalTokens: number
  promptTokens: number
  completionTokens: number
  models: string[]
}
