import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  BadRequestException,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiKey } from '../common/decorators/api-key.decorator'
import { Response } from 'express'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
  ApiParam,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import { ProxyService } from './proxy.service'
import { ProxyRequestDto } from './dto/proxy-request.dto'
import {
  ProxyResponseDto,
  OpenAIProxyResponseDto,
  AnthropicProxyResponseDto,
  ProxyErrorResponseDto
} from './dto/proxy-response.dto'
import { ErrorResponseDto } from '../common/dto/error-response.dto'
import { AdapterType } from '@prisma/client'

@ApiTags('Proxy')
@ApiExtraModels(ProxyResponseDto, OpenAIProxyResponseDto, AnthropicProxyResponseDto, ProxyErrorResponseDto, ErrorResponseDto)
@ApiHeader({
  name: 'x-api-key',
  description: 'Tenant API key for authentication',
  required: true,
  schema: { type: 'string' },
  example: 'tnnt_01h9xgsvs3kqb6qj6zd9kh7qpz',
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing API key',
  type: ErrorResponseDto,
})
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) { }

  @Post(':adapter')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Proxy a request to an AI service',
    description: 'Forwards a request to the specified AI service using the tenant\'s stored credentials. Automatically tracks token usage for analytics.',
    operationId: 'proxyRequest',
  })
  @ApiParam({
    name: 'adapter',
    description: 'The AI service adapter to use',
    required: true,
    schema: {
      enum: Object.values(AdapterType),
    },
    example: 'openai',
    examples: {
      openai: {
        value: 'openai',
        summary: 'OpenAI API',
      },
      anthropic: {
        value: 'anthropic',
        summary: 'Anthropic API',
      },
      cohere: {
        value: 'cohere',
        summary: 'Cohere API',
      },
    },
  })
  @ApiBody({
    type: ProxyRequestDto,
    description: 'The payload to send to the AI service',
    examples: {
      openai: {
        summary: 'OpenAI chat completion request',
        value: {
          payload: {
            model: 'gpt-4',
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: 'Hello, how are you?' }
            ],
            temperature: 0.7,
            max_tokens: 150
          }
        }
      },
      anthropic: {
        summary: 'Anthropic chat completion request',
        value: {
          payload: {
            model: 'claude-3-opus-20240229',
            messages: [
              { role: 'user', content: 'Hello, how are you?' }
            ],
            temperature: 0.7,
            max_tokens: 150
          }
        }
      },
    }
  })
  @ApiOkResponse({
    description: 'The response from the AI service',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(OpenAIProxyResponseDto) },
        { $ref: getSchemaPath(AnthropicProxyResponseDto) },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing API key',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request - Missing or invalid parameters',
    type: ProxyErrorResponseDto,
  })
  async proxyRequest(
    @Param('adapter') adapter: string,
    @ApiKey() apiKey: string,
    @Body() dto: ProxyRequestDto,
  ) {
    if (!adapter) {
      throw new BadRequestException('Adapter is required')
    }

    return this.proxyService.handleProxyRequest(adapter, apiKey, dto.payload)
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get usage statistics for the tenant' })
  @ApiResponse({
    status: 200,
    description: 'Usage statistics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getStats(@ApiKey() apiKey: string) {
    return this.proxyService.getUsageStats(apiKey)
  }

  @Post(':adapter/stream')
  @ApiOperation({ summary: 'Proxy a streaming request to an AI service' })
  @ApiParam({
    name: 'adapter',
    description: 'The AI service adapter to use (openai, anthropic, cohere)',
    required: true,
  })
  @ApiBody({ type: ProxyRequestDto })
  async streamProxyRequest(
    @Param('adapter') adapter: string,
    @ApiKey() apiKey: string,
    @Body() dto: ProxyRequestDto,
    @Res() response: Response,
  ) {
    if (!adapter) {
      throw new BadRequestException('Adapter is required')
    }

    return this.proxyService.handleStreamingProxyRequest(adapter, apiKey, dto.payload, response)
  }
}
