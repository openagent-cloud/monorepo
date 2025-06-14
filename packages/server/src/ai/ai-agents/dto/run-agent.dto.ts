import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RunAgentDto {
  @ApiProperty({ description: 'Input text for the agent' })
  @IsString()
  input: string;

  @ApiProperty({ required: false, description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
