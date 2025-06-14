import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../utils/prisma/prisma.service'
import { ConfigService } from '../utils/config/config.service'
import { CreateTenantDto } from './dto/create-tenant.dto'
import * as crypto from 'crypto'

/**
 * Generate a random ID with the specified length using the crypto module
 * @param length The length of the ID to generate
 * @returns A random string of the specified length
 */
function generateRandomId(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const randomBytes = crypto.randomBytes(length)
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % chars.length
    result += chars[randomIndex]
  }

  return result
}

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Create a new tenant with a generated API key
   * @param adminKey The admin API key for authentication
   * @param dto The tenant data
   * @returns The created tenant with API key
   */
  async createTenant(adminKey: string, dto: CreateTenantDto) {
    // Verify admin key
    if (adminKey !== this.configService.adminApiKey) {
      throw new UnauthorizedException('Invalid admin API key')
    }
    // Check if tenant with this name already exists
    const existingTenant = await this.prisma.tenant.findFirst({
      where: { name: dto.name }
    })

    if (existingTenant) {
      throw new ConflictException(`Tenant with name '${dto.name}' already exists`)
    }

    // Generate a unique API key with prefix
    const api_key = `tnnt_${generateRandomId(24)}`

    // Create the tenant
    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        api_key
      },
      select: {
        id: true,
        name: true,
        api_key: true,
        created_at: true
      }
    })

    return tenant
  }

  /**
   * Generate a new API key for an existing tenant
   * @param adminKey The admin API key for authentication
   * @param tenantId The tenant ID int to generate a new key for
   * @returns The updated tenant with the new API key
   */
  async regenerateApiKey(adminKey: string, tenantId: number) {
    // Verify admin key
    if (adminKey !== this.configService.adminApiKey) {
      throw new UnauthorizedException('Invalid admin API key')
    }

    // Find the tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId }
    })

    if (!tenant) {
      throw new UnauthorizedException('Tenant not found')
    }

    // Generate a new API key
    const newApiKey = `tnnt_${generateRandomId(24)}`

    // Update the tenant
    const updatedTenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { api_key: newApiKey },
      select: {
        id: true,
        name: true,
        api_key: true,
        created_at: true
      }
    })

    return updatedTenant
  }

  /**
   * List all tenants
   * @param adminKey The admin API key for authentication
   * @returns List of all tenants
   */
  async listTenants(adminKey: string) {
    // Verify admin key
    if (adminKey !== this.configService.adminApiKey) {
      throw new UnauthorizedException('Invalid admin API key')
    }

    return this.prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        api_key: true,
        created_at: true
      }
    })
  }
}
