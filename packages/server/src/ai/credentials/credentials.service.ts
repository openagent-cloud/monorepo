import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { ConfigService } from '../../utils/config/config.service'
import { LoggerService } from '../../utils/logger/logger.service'
import { encrypt } from '../../utils/encryption/encryption.util'
import { CreateCredentialDto } from './dto/create-credential.dto'

// Import the adapter_type enum directly
import { adapter_type } from '@prisma/client'

@Injectable()
export class CredentialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    // Set the context for all logs from this service
    this.logger.setContext('CredentialsService')
  }

  /**
   * Store a new credential for a tenant
   * @param api_key The tenant's API key
   * @param dto The credential data to store
   * @returns The created credential (without the encrypted key)
   */
  async storeCredential(api_key: string, dto: CreateCredentialDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { api_key }
    })

    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    // Convert service string to lowercase for consistency
    const serviceType = dto.service ? dto.service.toLowerCase() : ''
    this.logger.debug(`Service type: ${serviceType}`, 'CredentialsService')

    // Map the service string to the correct adapter_type enum value
    let adapter_type: adapter_type
    switch (serviceType) {
      case 'openai':
        adapter_type = 'openai' as adapter_type
        break
      case 'anthropic':
        adapter_type = 'anthropic' as adapter_type
        break
      case 'cohere':
        adapter_type = 'cohere' as adapter_type
        break
      default:
        throw new Error(`Unsupported adapter: ${serviceType}`)
    }

    this.logger.debug(`Using adapter type: ${adapter_type}`, 'CredentialsService')

    // Check if credential for this service already exists
    const existingCred = await this.prisma.credential.findFirst({
      where: {
        tenant_id: tenant.id,
        service: adapter_type
      }
    })

    // If exists, update it
    if (existingCred) {
      return this.prisma.credential.update({
        where: { id: existingCred.id },
        data: {
          encrypted_key: encrypt(dto.key, this.configService.encryptionKey),
          meta: dto.metadata || {}
        },
        select: {
          id: true,
          service: true,
          meta: true,
          created_at: true
        }
      })
    }

    // Otherwise create a new one
    this.logger.log(`Creating new credential with service: ${adapter_type}`, 'CredentialsService')

    return this.prisma.credential.create({
      data: {
        tenant_id: tenant.id,
        service: adapter_type,
        encrypted_key: encrypt(dto.key, this.configService.encryptionKey),
        meta: dto.metadata || {}
      },
      select: {
        id: true,
        service: true,
        meta: true,
        created_at: true
      }
    })
  }

  /**
   * List all credentials for a tenant
   * @param api_key The tenant's API key
   * @returns List of credentials (without the encrypted keys)
   */
  async listCredentials(api_key: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { api_key }
    })

    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    return this.prisma.credential.findMany({
      where: { tenant_id: tenant.id },
      select: {
        id: true,
        service: true,
        meta: true,
        created_at: true
      }
    })
  }

  /**
   * Delete a credential
   * @param api_key The tenant's API key
   * @param id The credential ID to delete
   */
  async deleteCredential(api_key: string, id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { api_key }
    })

    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    const credential = await this.prisma.credential.findFirst({
      where: {
        id,
        tenant_id: tenant.id
      }
    })

    if (!credential) {
      throw new UnauthorizedException('Credential not found or not owned by this tenant')
    }

    return this.prisma.credential.delete({
      where: { id },
      select: {
        id: true,
        service: true
      }
    })
  }
}
