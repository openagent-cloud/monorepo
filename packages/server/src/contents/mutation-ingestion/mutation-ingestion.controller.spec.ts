import { Test, TestingModule } from '@nestjs/testing'
import { BadRequestException } from '@nestjs/common'
import { MutationIngestionController } from './mutation-ingestion.controller'
import { MutationIngestionService } from './mutation-ingestion.service'
import { MutationType } from './dto/mutation.dto'
import { PrismaService } from '../../utils/prisma/prisma.service'

// Mock AuthGuard
jest.mock('../../auth/guards/auth.guard', () => ({
  AuthGuard: jest.fn().mockImplementation(() => {
    return { canActivate: jest.fn().mockReturnValue(true) }
  })
}))

describe('MutationIngestionController', () => {
  let controller: MutationIngestionController
  let service: MutationIngestionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MutationIngestionController],
      providers: [
        {
          provide: MutationIngestionService,
          useValue: {
            processMutations: jest.fn().mockResolvedValue({ txid: 'test-txid' })
          }
        },
        {
          provide: PrismaService,
          useValue: {
            tenant: { findUnique: jest.fn() },
            content: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn()
            },
            $transaction: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<MutationIngestionController>(MutationIngestionController)
    service = module.get<MutationIngestionService>(MutationIngestionService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('ingestMutations', () => {
    it('should process valid mutations and return success response', async function (this: void) {
      const validMutations = [
        {
          type: MutationType.INSERT,
          collection: 'content',
          value: {
            title: 'Test Comment',
            author_id: 1,
            content_type_id: 5,
            parent_id: 42,
            metadata: { kind: 'text' },
            access_type: 'public'
          }
        }
      ]

      const mockReq = { user: { tenantId: 'test-tenant-id' } }
      const result = await controller.ingestMutations(validMutations, mockReq)
      expect(service.processMutations).toHaveBeenCalledWith(validMutations, mockReq.user)
      expect(result).toEqual({ success: true, txid: 'test-txid' })
    })

    it('should throw BadRequestException when empty mutations array is provided', async function (this: void) {
      const emptyMutations = []

      const mockReq = { user: { tenantId: 'test-tenant-id' } }
      await expect(controller.ingestMutations(emptyMutations, mockReq)).rejects.toThrow(
        BadRequestException
      )
      expect(service.processMutations).not.toHaveBeenCalled()
    })

    it('should throw BadRequestException when null mutations array is provided', async function (this: void) {
      // Using type assertion to bypass TypeScript type checking for test purposes
      const nullMutations = null as any

      const mockReq = { user: { tenantId: 'test-tenant-id' } }
      await expect(controller.ingestMutations(nullMutations, mockReq)).rejects.toThrow(
        BadRequestException
      )
      expect(service.processMutations).not.toHaveBeenCalled()
    })
  })
})
