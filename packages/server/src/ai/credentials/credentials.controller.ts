import { Body, Controller, Delete, Get, Param, Post, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiKey } from '../../utils/decorators/api-key.decorator'
import {
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiParam,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger'
import { CredentialsService } from './credentials.service'
import { CreateCredentialDto } from './dto/create-credential.dto'
import { CredentialResponseDto } from './dto/credential-response.dto'
import { ErrorResponseDto } from '../../utils/dto/error-response.dto'

@ApiTags('Credentials')
@ApiExtraModels(CredentialResponseDto, ErrorResponseDto)
@ApiHeader({
  name: 'x-api-key',
  description: 'Tenant API key for authentication',
  required: true,
  schema: { type: 'string' },
  example: 'tnnt_01h9xgsvs3kqb6qj6zd9kh7qpz'
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing API key',
  type: ErrorResponseDto
})
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly service: CredentialsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Store a new credential',
    description:
      'Creates or updates a credential for the specified service. If a credential already exists for this service, it will be updated.',
    operationId: 'createCredential'
  })
  @ApiBody({
    type: CreateCredentialDto,
    description: 'Credential data to store',
    examples: {
      openai: {
        summary: 'OpenAI credential',
        value: {
          service: 'openai',
          key: 'sk-abcdefghijklmnopqrstuvwxyz123456',
          metadata: { default_model: 'gpt-4' }
        }
      },
      anthropic: {
        summary: 'Anthropic credential',
        value: {
          service: 'anthropic',
          key: 'sk-ant-api123456789abcdefghijklmnopqrstuvwxyz',
          metadata: { default_model: 'claude-3-opus' }
        }
      }
    }
  })
  @ApiCreatedResponse({
    description: 'The credential has been successfully stored.',
    type: CredentialResponseDto,
    schema: {
      allOf: [{ $ref: getSchemaPath(CredentialResponseDto) }]
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing API key',
    type: ErrorResponseDto
  })
  async create(@ApiKey() apiKey: string, @Body() dto: CreateCredentialDto) {
    return this.service.storeCredential(apiKey, dto)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all credentials for the tenant',
    description:
      'Retrieves all credentials associated with the tenant. Credential keys are not included in the response for security reasons.',
    operationId: 'listCredentials'
  })
  @ApiOkResponse({
    description: 'List of credentials (without secrets)',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(CredentialResponseDto) }
    },
    isArray: true
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing API key',
    type: ErrorResponseDto
  })
  async list(@ApiKey() apiKey: string) {
    return this.service.listCredentials(apiKey)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a credential',
    description:
      "Permanently removes a credential from the tenant's account. This action cannot be undone.",
    operationId: 'deleteCredential'
  })
  @ApiParam({
    name: 'id',
    description: 'Credential ID to delete',
    required: true,
    example: 'cred_01h9xgsvs3kqb6qj6zd9kh7qpz',
    schema: { type: 'string' }
  })
  @ApiOkResponse({
    description: 'The credential has been successfully deleted',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        message: {
          type: 'string',
          example: 'Credential deleted successfully'
        },
        id: {
          type: 'string',
          example: 'cred_01h9xgsvs3kqb6qj6zd9kh7qpz'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing API key',
    type: ErrorResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Not Found - Credential does not exist or belongs to another tenant',
    type: ErrorResponseDto
  })
  async delete(@ApiKey() apiKey: string, @Param('id') id: string) {
    return this.service.deleteCredential(apiKey, id)
  }
}
