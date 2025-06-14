import { Test, TestingModule } from '@nestjs/testing';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { RunAgentDto } from './dto/run-agent.dto';
import { NotFoundException } from '@nestjs/common';

// Mock the entire @openai/agents module to prevent import errors
jest.mock('@openai/agents', () => ({
  Agent: jest.fn(),
  run: jest.fn(),
  tool: jest.fn(),
  setDefaultOpenAIKey: jest.fn(),
}));

describe('AgentsController', () => {
  let controller: AgentsController;
  let service: AgentsService;

  const mockAgentsService = {
    createAgent: jest.fn(),
    listAgents: jest.fn(),
    getAgent: jest.fn(),
    deleteAgent: jest.fn(),
    runAgent: jest.fn(),
    addHandoff: jest.fn(),
  };

  // Sample test data
  const mockApiKey = 'test-api-key';
  const mockAgent = {
    id: 'agent-id-1',
    name: 'Test Agent',
    tenant_id: 1,
    description: 'Test description',
    instructions: 'Test instructions',
    model: 'gpt-4',
    tools: ['sha256_hash'],
    is_active: true,
    handoffs: [],
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [
        {
          provide: AgentsService,
          useValue: mockAgentsService,
        },
      ],
    }).compile();

    controller = module.get<AgentsController>(AgentsController);
    service = module.get<AgentsService>(AgentsService);
    
    // Set up default mock responses
    mockAgentsService.createAgent.mockResolvedValue(mockAgent);
    mockAgentsService.listAgents.mockResolvedValue([mockAgent]);
    mockAgentsService.getAgent.mockResolvedValue(mockAgent);
    mockAgentsService.deleteAgent.mockResolvedValue(mockAgent);
    mockAgentsService.runAgent.mockResolvedValue({ 
      output: 'Test output', 
      runId: 'run-id-1',
      metadata: { finalOutput: 'Test output' } 
    });
    mockAgentsService.addHandoff.mockResolvedValue({
      ...mockAgent,
      handoffs: [{ id: 'agent-id-2', name: 'Handoff Agent' }]
    });
  });

  describe('createAgent', () => {
    it('should create an agent', async () => {
      const createAgentDto: CreateAgentDto = {
        name: 'New Agent',
        instructions: 'Test instructions',
        tools: ['sha256_hash'],
      };
      
      const result = await controller.createAgent(mockApiKey, createAgentDto);
      
      expect(result).toEqual(mockAgent);
      expect(mockAgentsService.createAgent).toHaveBeenCalledWith(mockApiKey, createAgentDto);
    });
  });

  describe('listAgents', () => {
    it('should return an array of agents', async () => {
      const result = await controller.listAgents(mockApiKey);
      
      expect(result).toEqual([mockAgent]);
      expect(mockAgentsService.listAgents).toHaveBeenCalledWith(mockApiKey);
    });
  });

  describe('getAgent', () => {
    it('should return a single agent by ID', async () => {
      const result = await controller.getAgent(mockApiKey, 'agent-id-1');
      
      expect(result).toEqual(mockAgent);
      expect(mockAgentsService.getAgent).toHaveBeenCalledWith(mockApiKey, 'agent-id-1');
    });

    it('should handle not found errors', async () => {
      mockAgentsService.getAgent.mockRejectedValueOnce(new NotFoundException());
      
      await expect(controller.getAgent(mockApiKey, 'non-existent'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAgent', () => {
    it('should delete an agent', async () => {
      const result = await controller.deleteAgent(mockApiKey, 'agent-id-1');
      
      expect(result).toEqual(mockAgent);
      expect(mockAgentsService.deleteAgent).toHaveBeenCalledWith(mockApiKey, 'agent-id-1');
    });
  });

  describe('runAgent', () => {
    it('should run an agent with provided input', async () => {
      const runAgentDto: RunAgentDto = {
        input: 'Test input',
      };
      
      const result = await controller.runAgent(mockApiKey, 'agent-id-1', runAgentDto);
      
      expect(result).toEqual({
        output: 'Test output',
        runId: 'run-id-1',
        metadata: { finalOutput: 'Test output' }
      });
      expect(mockAgentsService.runAgent).toHaveBeenCalledWith(mockApiKey, 'agent-id-1', runAgentDto);
    });
  });

  describe('addHandoff', () => {
    it('should connect two agents with a handoff relationship', async () => {
      const result = await controller.addHandoff(mockApiKey, 'agent-id-1', 'agent-id-2');
      
      expect(result).toEqual({
        ...mockAgent,
        handoffs: [{ id: 'agent-id-2', name: 'Handoff Agent' }]
      });
      expect(mockAgentsService.addHandoff).toHaveBeenCalledWith(mockApiKey, 'agent-id-1', 'agent-id-2');
    });
  });
});
