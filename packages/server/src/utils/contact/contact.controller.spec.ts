import { Test, TestingModule } from '@nestjs/testing'
import { ContactController } from './contact.controller'
import { ContactService } from './contact.service'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { CreateContactDto } from './dto/create-contact.dto'

// Create mock guard
const mockAuthGuard = { canActivate: jest.fn().mockImplementation(() => true) }

describe('ContactController', () => {
  let controller: ContactController
  let service: ContactService

  const mockContactService = {
    create: jest.fn(),
    findAll: jest.fn()
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: mockContactService
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile()

    controller = module.get<ContactController>(ContactController)
    service = module.get<ContactService>(ContactService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a contact', async () => {
      const createContactDto: CreateContactDto = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Contact Request',
        message: 'Hello, world!',
        tenantId: 1
      }
      
      const mockCreatedContact = {
        id: 1,
        ...createContactDto,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      mockContactService.create.mockResolvedValue(mockCreatedContact)
      
      // Note: no @UseGuards on create, so guards won't be tested here
      const result = await controller.create(createContactDto)
      
      expect(service.create).toHaveBeenCalledWith(createContactDto)
      expect(result).toEqual(mockCreatedContact)
    })
  })

  describe('findAll', () => {
    it('should return all contacts when user has proper roles', async () => {
      const mockContacts = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Hello, world!',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          message: 'Hi there!',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
      
      mockContactService.findAll.mockResolvedValue(mockContacts)
      mockAuthGuard.canActivate.mockReturnValue(true)
      
      const result = await controller.findAll(1)
      
      expect(result).toEqual(mockContacts)
      
      // In a real test with e2e testing, we would verify that:
      // 1. AuthGuard is applied (@UseGuards(AuthGuard))
      // 2. AuthGuard properly checks @JwtOnly(), @RequireModules() and @Roles() decorators
      // But in unit tests we're just verifying controller behavior assuming guards work
    })
    
    it('should call the findAll method from service', async () => {
      const mockContacts = []
      mockContactService.findAll.mockResolvedValue(mockContacts)
      
      await controller.findAll(1)
      
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  // We would add tests for the remaining endpoints in the controller here
})
