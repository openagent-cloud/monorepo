import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common'
import { AdminKey } from '../common/decorators/api-key.decorator'
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiHeader,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  getSchemaPath,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { TenantService } from './tenant.service'
import { CreateTenantDto } from './dto/create-tenant.dto'
import { TenantResponseDto } from './dto/tenant-response.dto'
import { ErrorResponseDto } from '../common/dto/error-response.dto'

@ApiTags('Tenants')
@ApiExtraModels(TenantResponseDto, ErrorResponseDto)
@ApiHeader({
  name: 'x-admin-key',
  description: 'Admin API key for authentication',
  required: true,
  schema: { type: 'string' },
})
@Controller('tenants')
export class TenantController {
  constructor(private readonly service: TenantService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new tenant',
    description: 'Creates a new tenant with a generated API key. Requires admin authentication.',
    operationId: 'createTenant',
  })
  @ApiBody({
    type: CreateTenantDto,
    description: 'Tenant data',
    examples: {
      tenant: {
        summary: 'New tenant',
        value: {
          name: 'Acme Corporation',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'The tenant has been successfully created',
    type: TenantResponseDto,
    schema: {
      allOf: [{ $ref: getSchemaPath(TenantResponseDto) }],
    },
  })
  @ApiConflictResponse({
    description: 'Conflict - A tenant with this name already exists',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing admin key',
    type: ErrorResponseDto,
  })
  async create(
    @AdminKey() adminKey: string,
    @Body() dto: CreateTenantDto
  ) {
    return this.service.createTenant(adminKey, dto)
  }

  @Post(':id/regenerate-key')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Regenerate API key for a tenant',
    description: 'Generates a new API key for the specified tenant. The old key will no longer work.',
    operationId: 'regenerateTenantKey',
  })
  @ApiOkResponse({
    description: 'The API key has been successfully regenerated',
    type: TenantResponseDto,
    schema: {
      allOf: [{ $ref: getSchemaPath(TenantResponseDto) }],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing admin key',
    type: ErrorResponseDto,
  })
  async regenerateKey(
    @AdminKey() adminKey: string,
    @Param('id') id: string,
  ) {
    return this.service.regenerateApiKey(adminKey, id)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List all tenants',
    description: 'Retrieves all tenants in the system. Requires admin authentication.',
    operationId: 'listTenants',
  })
  @ApiOkResponse({
    description: 'List of all tenants',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(TenantResponseDto) },
    },
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing admin key',
    type: ErrorResponseDto,
  })
  async list(@AdminKey() adminKey: string) {
    return this.service.listTenants(adminKey)
  }
}
