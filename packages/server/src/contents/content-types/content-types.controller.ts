// HOT-RELOAD TEST COMMENT - THIS SHOULD TRIGGER A RESTART
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
  ForbiddenException,
  Req
} from '@nestjs/common'
import { ContentTypesService } from './content-types.service'
import { CreateContentTypeDto } from './dto/create-content-type.dto'
import { UpdateContentTypeDto } from './dto/update-content-type.dto'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { GetTenant, JwtOnly, RequireModules, Roles } from '../../auth/decorators/auth-decorators'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { Request as ExpressRequest } from 'express'
import { user_role, module } from '@prisma/client'

// Extend Express Request to include user with role property
interface Request extends ExpressRequest {
  user?: {
    id: number
    role: user_role
    tenantId: number
    [key: string]: any
  }
}

/**
 * Controller for managing content type schemas in the Electric Stack ecosystem.
 * Content types define the structure and validation rules for content items.
 * Some operations require superadmin privileges for security reasons.
 * All endpoints require valid JWT authentication.
 */
@ApiTags('Content')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@JwtOnly()
@RequireModules(module.content)
@Roles(user_role.superadmin)
@Controller('content-types')
export class ContentTypesController {
  constructor(private readonly contentTypesService: ContentTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new content type',
    description: 'Creates a new content type schema. Requires superadmin role.'
  })
  @ApiBody({ type: CreateContentTypeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Content type successfully created'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Valid authentication required'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Requires superadmin role'
  })
  create(
    @Body(ValidationPipe) createContentTypeDto: CreateContentTypeDto,
    @GetTenant() tenantId: number,
    @Req() req: Request
  ) {
    // Only allow superadmin to create content types
    if (req.user?.role !== 'superadmin') {
      throw new ForbiddenException('Only superadmin can create content types')
    }
    return this.contentTypesService.create(createContentTypeDto, tenantId)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all content types',
    description: 'Retrieves all content types for the authenticated tenant'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Content types successfully retrieved'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Valid authentication required'
  })
  findAll(@GetTenant() tenantId: number) {
    return this.contentTypesService.findAll(tenantId)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get content type by ID',
    description: 'Retrieves a specific content type by its ID'
  })
  @ApiParam({ name: 'id', description: 'Content type ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Content type found'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Content type not found'
  })
  findOne(@Param('id') id: string, @GetTenant() tenantId: number) {
    return this.contentTypesService.findOne(+id, tenantId)
  }

  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get content type by name',
    description: 'Retrieves a specific content type by its name'
  })
  @ApiParam({ name: 'name', description: 'Content type name', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Content type found'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Content type not found'
  })
  findByName(@Param('name') name: string, @GetTenant() tenantId: number) {
    return this.contentTypesService.findByName(name, tenantId)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update content type',
    description: 'Updates a specific content type schema. Requires superadmin role.'
  })
  @ApiParam({ name: 'id', description: 'Content type ID', type: Number })
  @ApiBody({ type: UpdateContentTypeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Content type successfully updated'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Content type not found'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Valid authentication required'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Requires superadmin role'
  })
  update(
    @Param('id') id: string,
    @Body() updateContentTypeDto: UpdateContentTypeDto,
    @GetTenant() tenantId: number,
    @Req() req: Request
  ) {
    // Only allow superadmin to update content types
    if (req.user?.role !== 'superadmin') {
      throw new ForbiddenException('Only superadmin can update content types')
    }
    return this.contentTypesService.update(+id, updateContentTypeDto, tenantId)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete content type',
    description: 'Deletes a specific content type schema. Requires superadmin role.'
  })
  @ApiParam({ name: 'id', description: 'Content type ID', type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Content type successfully deleted'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Content type not found'
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Valid authentication required'
  })
  @ApiForbiddenResponse({
    description: 'Forbidden - Requires superadmin role'
  })
  remove(@Param('id') id: string, @GetTenant() tenantId: number, @Req() req: Request) {
    // Only allow superadmin to delete content types
    if (req.user?.role !== 'superadmin') {
      throw new ForbiddenException('Only superadmin can delete content types')
    }
    return this.contentTypesService.remove(+id, tenantId)
  }
}
