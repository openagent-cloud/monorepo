import { Test, TestingModule } from '@nestjs/testing';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { UnauthorizedException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';

// Mock the ApiKey decorator
jest.mock('../common/decorators/api-key.decorator', () => ({
  ApiKey: jest.fn().mockImplementation(() => {
    return (target: any, key: string, index: number) => {
      // This is a parameter decorator, so we don't need to do anything in the test
    };
  }),
}));

describe('CredentialController', () => {
  let controller: CredentialController;
  let service: CredentialService;

  // Mock credential service
  const mockCredentialService = {
    storeCredential: jest.fn(),
    listCredentials: jest.fn(),
    deleteCredential: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredentialController],
      providers: [
        {
          provide: CredentialService,
          useValue: mockCredentialService,
        },
      ],
    }).compile();

    controller = module.get<CredentialController>(CredentialController);
    service = module.get<CredentialService>(CredentialService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.storeCredential with correct parameters', async () => {
      const apiKey = 'test-api-key';
      const dto = { 
        service: 'openai',
        key: 'sk-test-key',
        metadata: { model: 'gpt-4' }
      };
      
      mockCredentialService.storeCredential.mockResolvedValue({ id: 'cred-id' });
      
      await controller.create(apiKey, dto);
      
      expect(service.storeCredential).toHaveBeenCalledWith(apiKey, dto);
    });
  });

  describe('list', () => {
    it('should call service.listCredentials with correct parameters', async () => {
      const apiKey = 'test-api-key';
      mockCredentialService.listCredentials.mockResolvedValue([]);
      
      await controller.list(apiKey);
      
      expect(service.listCredentials).toHaveBeenCalledWith(apiKey);
    });
  });

  describe('delete', () => {
    it('should call service.deleteCredential with correct parameters', async () => {
      const apiKey = 'test-api-key';
      const credId = 'cred-id';
      mockCredentialService.deleteCredential.mockResolvedValue({ success: true });
      
      await controller.delete(apiKey, credId);
      
      expect(service.deleteCredential).toHaveBeenCalledWith(apiKey, credId);
    });
  });
});
