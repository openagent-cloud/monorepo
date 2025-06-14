import { ApiProperty } from '@nestjs/swagger';

/**
 * Base response DTO for proxy requests
 * This is a generic structure that can be extended for specific adapter responses
 */
export class ProxyResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response data from the AI service',
    example: {
      id: 'chatcmpl-123456789',
      choices: [
        {
          message: {
            role: 'assistant',
            content: 'Hello! How can I help you today?'
          }
        }
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 8,
        total_tokens: 18
      }
    },
    type: 'object',
    additionalProperties: true,
  })
  data: Record<string, any>;

  @ApiProperty({
    description: 'Token usage information',
    example: {
      promptTokens: 10,
      completionTokens: 8,
      totalTokens: 18,
      model: 'gpt-4',
    },
    type: 'object',
    required: false,
  })
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    model: string;
  };

  @ApiProperty({
    description: 'Timestamp of when the request was processed',
    example: '2025-05-18T07:15:32.000Z',
    type: String,
    format: 'date-time',
  })
  timestamp: string;
}

/**
 * OpenAI specific response DTO
 */
export class OpenAIProxyResponseDto extends ProxyResponseDto {
  @ApiProperty({
    description: 'OpenAI specific response data',
    example: {
      id: 'chatcmpl-123456789',
      object: 'chat.completion',
      created: 1684779054,
      model: 'gpt-4',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello! How can I help you today?'
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 8,
        total_tokens: 18
      }
    },
    type: 'object',
  })
  declare data: Record<string, any>;
}

/**
 * Anthropic specific response DTO
 */
export class AnthropicProxyResponseDto extends ProxyResponseDto {
  @ApiProperty({
    description: 'Anthropic specific response data',
    example: {
      id: 'msg_0123456789abcdef',
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: 'Hello! How can I help you today?'
        }
      ],
      model: 'claude-3-opus-20240229',
      stop_reason: 'end_turn',
      usage: {
        input_tokens: 10,
        output_tokens: 8
      }
    },
    type: 'object',
  })
  declare data: Record<string, any>;
}

/**
 * Error response DTO for proxy requests
 */
export class ProxyErrorResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: false,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Error message',
    example: 'Failed to proxy request to OpenAI: Invalid API key',
    type: String,
  })
  error: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp of when the error occurred',
    example: '2025-05-18T07:15:32.000Z',
    type: String,
    format: 'date-time',
  })
  timestamp: string;
}
