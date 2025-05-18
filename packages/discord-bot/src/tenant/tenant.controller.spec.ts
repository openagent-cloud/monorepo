import { Test, TestingModule } from '@nestjs/testing';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';

// Mock the AdminKey decorator
jest.mock('../common/decorators/api-key.decorator', () => ({
  AdminKey: jest.fn().mockImplementation(() => {
    return (target: any, key: string, index: number) => {
      // This is a parameter decorator, so we don't need to do anything in the test
    };
  }),
}));

describe('TenantController', () => {
  let controller: TenantController;
  let service: TenantService;

  // Mock tenant service
  const mockTenantService = {
    createTenant: jest.fn(),
    regenerateApiKey: jest.fn(),
    listTenants: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        {
          provide: TenantService,
          useValue: mockTenantService,
        },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
    service = module.get<TenantService>(TenantService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.createTenant with correct parameters', async () => {
      const adminKey = 'test-admin-key';
      const dto: CreateTenantDto = { 
        name: 'Test Tenant',
        contactEmail: 'test@example.com'
      };
      
      mockTenantService.createTenant.mockResolvedValue({ 
        id: 'tenant-id',
        name: 'Test Tenant',
        apiKey: 'tenant-api-key',
        contactEmail: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const result = await controller.create(adminKey, dto);
      
      expect(service.createTenant).toHaveBeenCalledWith(adminKey, dto);
      expect(result).toHaveProperty('apiKey');
    });
  });

  describe('regenerateKey', () => {
    it('should call service.regenerateApiKey with correct parameters', async () => {
      const adminKey = 'test-admin-key';
      const tenantId = 'tenant-id';
      
      mockTenantService.regenerateApiKey.mockResolvedValue({ 
        id: tenantId,
        name: 'Test Tenant',
        apiKey: 'new-tenant-api-key',
        contactEmail: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const result = await controller.regenerateKey(adminKey, tenantId);
      
      expect(service.regenerateApiKey).toHaveBeenCalledWith(adminKey, tenantId);
      expect(result).toHaveProperty('apiKey', 'new-tenant-api-key');
    });
  });

  describe('list', () => {
    it('should call service.listTenants with correct parameters', async () => {
      const adminKey = 'test-admin-key';
      
      mockTenantService.listTenants.mockResolvedValue([
        { 
          id: 'tenant-id-1',
          name: 'Test Tenant 1',
          apiKey: 'tenant-api-key-1',
          contactEmail: 'test1@example.com',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: 'tenant-id-2',
          name: 'Test Tenant 2',
          apiKey: 'tenant-api-key-2',
          contactEmail: 'test2@example.com',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
      
      const result = await controller.list(adminKey);
      
      expect(service.listTenants).toHaveBeenCalledWith(adminKey);
      expect(result).toHaveLength(2);
    });
  });
});
