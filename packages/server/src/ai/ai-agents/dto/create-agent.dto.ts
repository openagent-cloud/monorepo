import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ 
    description: 'Name of the agent',
    example: 'Customer Support Agent'
  })
  @IsString()
  name: string;

  @ApiProperty({ 
    required: false, 
    description: 'Description of the agent',
    example: 'An AI agent that handles customer support inquiries'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'Instructions for the agent (formerly called prompt)',
    example: 'You are a customer support agent. Help customers with their questions about our products.'
  })
  @IsString()
  instructions: string;

  @ApiProperty({ 
    default: 'gpt-4', 
    required: false,
    example: 'gpt-4-turbo-preview'
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ 
    type: [String], 
    default: [], 
    required: false,
    example: ['search_tool', 'calculator_tool']
  })
  @IsArray()
  @IsOptional()
  tools?: string[];

  @ApiProperty({ 
    type: [String], 
    default: [], 
    required: false,
    example: ['agent-id-1', 'agent-id-2']
  })
  @IsArray()
  @IsOptional()
  handoffs?: string[];

  @ApiProperty({ 
    default: true, 
    required: false,
    example: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
