import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ConfigService } from '../config/config.service'
import { encrypt } from '../utils/encryption.util'
import { CreateCredentialDto } from './dto/create-credential.dto'

// Import the AdapterType enum directly
import { AdapterType } from '@prisma/client'

@Injectable()
export class CredentialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Store a new credential for a tenant
   * @param apiKey The tenant's API key
   * @param dto The credential data to store
   * @returns The created credential (without the encrypted key)
   */
  async storeCredential(apiKey: string, dto: CreateCredentialDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { apiKey },
    })

    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    // Convert service string to lowercase for consistency
    const serviceType = dto.service ? dto.service.toLowerCase() : '';
    console.log('Service type:', serviceType);

    // Map the service string to the correct AdapterType enum value
    let adapterType: AdapterType;
    switch (serviceType) {
      case 'openai':
        adapterType = 'openai' as AdapterType;
        break;
      case 'anthropic':
        adapterType = 'anthropic' as AdapterType;
        break;
      case 'cohere':
        adapterType = 'cohere' as AdapterType;
        break;
      default:
        throw new Error(`Unsupported adapter: ${serviceType}`);
    }

    console.log('Using adapter type:', adapterType);

    // Check if credential for this service already exists
    const existingCred = await this.prisma.credential.findFirst({
      where: {
        tenantId: tenant.id,
        service: adapterType,
      },
    })

    // If exists, update it
    if (existingCred) {
      return this.prisma.credential.update({
        where: { id: existingCred.id },
        data: {
          encryptedKey: encrypt(dto.key, this.configService.encryptionKey),
          meta: dto.metadata || {}
        },
        select: {
          id: true,
          service: true,
          meta: true,
          createdAt: true,
        },
      })
    }

    // Otherwise create a new one
    console.log('Creating new credential with service:', adapterType);

    return this.prisma.credential.create({
      data: {
        tenantId: tenant.id,
        service: adapterType,
        encryptedKey: encrypt(dto.key, this.configService.encryptionKey),
        meta: dto.metadata || {}
      },
      select: {
        id: true,
        service: true,
        meta: true,
        createdAt: true,
      },
    })
  }

  /**
   * List all credentials for a tenant
   * @param apiKey The tenant's API key
   * @returns List of credentials (without the encrypted keys)
   */
  async listCredentials(apiKey: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { apiKey },
    })

    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    return this.prisma.credential.findMany({
      where: { tenantId: tenant.id },
      select: {
        id: true,
        service: true,
        meta: true,
        createdAt: true,
      },
    })
  }

  /**
   * Delete a credential
   * @param apiKey The tenant's API key
   * @param id The credential ID to delete
   */
  async deleteCredential(apiKey: string, id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { apiKey },
    })

    if (!tenant) {
      throw new UnauthorizedException('Invalid API key')
    }

    const credential = await this.prisma.credential.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    })

    if (!credential) {
      throw new UnauthorizedException('Credential not found or not owned by this tenant')
    }

    return this.prisma.credential.delete({
      where: { id },
      select: {
        id: true,
        service: true,
      },
    })
  }
}
