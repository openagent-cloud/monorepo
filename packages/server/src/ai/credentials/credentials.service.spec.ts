import { Test, TestingModule } from '@nestjs/testing'
import { CredentialsService } from './credentials.service'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { ConfigService } from '../../utils/config/config.service'
import { UnauthorizedException } from '@nestjs/common'
import { adapter_type } from '@prisma/client'
import { LoggerService } from '../../utils/logger/logger.service'
import { CreateCredentialDto } from './dto/create-credential.dto'

// Mock the encryption utility
jest.mock('../../utils/encryption/encryption.util', () => ({
  encrypt: jest.fn().mockImplementation(() => {
    return JSON.stringify({
      iv: 'mock-iv',
      encrypted: 'mock-encrypted-data',
      authTag: 'mock-auth-tag'
    })
  }),
  decrypt: jest.fn().mockImplementation(() => 'decrypted-key')
}))

describe('CredentialsService', () => {
  let service: CredentialsService
  let prismaService: PrismaService
  let configService: ConfigService

  const mockPrismaService = {
    tenant: {
      findUnique: jest.fn()
    },
    credential: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn()
    }
  }

  const mockConfigService = {
    encryptionKey: 'test-encryption-key',
    adminApiKey: 'test-admin-key'
  }

  const mockLoggerService = {
    setContext: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
    logCredential: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    }).compile()

    service = module.get<CredentialsService>(CredentialsService)
    prismaService = module.get<PrismaService>(PrismaService)
    configService = module.get<ConfigService>(ConfigService)

    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('storeCredential', () => {
    const apiKey = 'tnnt_test123'
    const tenantId = 'tenant-123'
    const mockTenant = { id: tenantId, name: 'Test Tenant', apiKey }

    beforeEach(() => {
      mockPrismaService.tenant.findUnique.mockResolvedValue(mockTenant)
    })

    it('should throw UnauthorizedException if tenant not found', async () => {
      mockPrismaService.tenant.findUnique.mockResolvedValueOnce(null)

      const dto: CreateCredentialDto = {
        service: 'openai',
        key: 'sk-test123'
      }

      await expect(service.storeCredential('invalid-key', dto)).rejects.toThrow(
        UnauthorizedException
      )
    })

    it('should throw Error for unsupported adapter type', async () => {
      const dto: CreateCredentialDto = {
        service: 'unsupported-service',
        key: 'sk-test123'
      }

      await expect(service.storeCredential(apiKey, dto)).rejects.toThrow(
        'Unsupported adapter: unsupported-service'
      )
    })

    it('should correctly handle openai adapter type', async () => {
      const dto: CreateCredentialDto = {
        service: 'openai',
        key: 'sk-test123'
      }

      mockPrismaService.credential.findFirst.mockResolvedValueOnce(null)
      mockPrismaService.credential.create.mockResolvedValueOnce({
        id: 'cred-123',
        service: 'openai' as adapter_type,
        meta: {},
        createdAt: new Date()
      })

      await service.storeCredential(apiKey, dto)

      expect(mockPrismaService.credential.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            service: 'openai'
          })
        })
      )
    })

    it('should correctly handle anthropic adapter type', async () => {
      const dto: CreateCredentialDto = {
        service: 'anthropic',
        key: 'sk-ant-test123'
      }

      mockPrismaService.credential.findFirst.mockResolvedValueOnce(null)
      mockPrismaService.credential.create.mockResolvedValueOnce({
        id: 'cred-456',
        service: 'anthropic' as adapter_type,
        meta: {},
        createdAt: new Date()
      })

      await service.storeCredential(apiKey, dto)

      expect(mockPrismaService.credential.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            service: 'anthropic'
          })
        })
      )
    })

    it('should correctly handle cohere adapter type', async () => {
      const dto: CreateCredentialDto = {
        service: 'cohere',
        key: 'co-test123'
      }

      mockPrismaService.credential.findFirst.mockResolvedValueOnce(null)
      mockPrismaService.credential.create.mockResolvedValueOnce({
        id: 'cred-789',
        service: 'cohere' as adapter_type,
        meta: {},
        createdAt: new Date()
      })

      await service.storeCredential(apiKey, dto)

      expect(mockPrismaService.credential.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            service: 'cohere'
          })
        })
      )
    })

    it('should update existing credential if one exists for the service', async () => {
      const dto: CreateCredentialDto = {
        service: 'openai',
        key: 'sk-test123',
        metadata: { default_model: 'gpt-4' }
      }

      const existingCred = {
        id: 'cred-existing',
        service: 'openai' as adapter_type,
        tenantId,
        encryptedKey: 'encrypted-old-key',
        meta: {}
      }

      mockPrismaService.credential.findFirst.mockResolvedValueOnce(existingCred)
      mockPrismaService.credential.update.mockResolvedValueOnce({
        id: existingCred.id,
        service: existingCred.service,
        meta: dto.metadata,
        createdAt: new Date()
      })

      await service.storeCredential(apiKey, dto)

      expect(mockPrismaService.credential.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: existingCred.id },
          data: expect.objectContaining({
            meta: dto.metadata
          })
        })
      )
    })

    it('should handle case-insensitive service names', async () => {
      const dto: CreateCredentialDto = {
        service: 'OPENAI', // uppercase
        key: 'sk-test123'
      }

      mockPrismaService.credential.findFirst.mockResolvedValueOnce(null)
      mockPrismaService.credential.create.mockResolvedValueOnce({
        id: 'cred-123',
        service: 'openai' as adapter_type,
        meta: {},
        createdAt: new Date()
      })

      await service.storeCredential(apiKey, dto)

      expect(mockPrismaService.credential.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            service: 'openai' // should be lowercase
          })
        })
      )
    })
  })
})
