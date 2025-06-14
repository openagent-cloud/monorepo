import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  Request,
  UseGuards
} from '@nestjs/common'
import { ContentService } from './content.service'
import { CreateContentDto } from './dto/create-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { access_type, module } from '@prisma/client'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse
} from '@nestjs/swagger'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { GetTenant, RequireModules } from '../../auth/decorators/auth-decorators'

/**
 * Controller for managing content entities in the Electric Stack ecosystem.
 * Handles CRUD operations for content items, as well as content-specific features like comments, reactions,
 * and access control management. All endpoints require auth via the ONE TRUE GUARD.
 */
@ApiTags('Content')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@RequireModules(module.content)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new content',
    description: 'Creates a new content item with the provided data for the authenticated tenant'
  })
  @ApiBody({ type: CreateContentDto })
  @ApiResponse({
    status: 201,
    description: 'Content successfully created'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Valid authentication required'
  })
  @ApiBadRequestResponse({
    description: 'Invalid content data provided'
  })
  create(@Body() createContentDto: CreateContentDto, @GetTenant() tenantId: number) {
    return this.contentService.create(createContentDto, tenantId)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all content items',
    description: 'Retrieves content items with pagination and filter options'
  })
  @ApiQuery({ name: 'skip', description: 'Number of items to skip', required: false, type: Number })
  @ApiQuery({ name: 'take', description: 'Number of items to take', required: false, type: Number })
  @ApiQuery({
    name: 'contentTypeId',
    description: 'Filter by content type ID',
    required: false,
    type: String
  })
  @ApiQuery({ name: 'authorId', description: 'Filter by author ID', required: false, type: String })
  @ApiQuery({
    name: 'parentId',
    description: 'Filter by parent content ID (use "null" for root content)',
    required: false,
    type: String
  })
  @ApiQuery({
    name: 'accessType',
    description: 'Filter by access type',
    required: false,
    enum: access_type
  })
  @ApiResponse({
    status: 200,
    description: 'Content items successfully retrieved'
  })
  @ApiBadRequestResponse({
    description: 'Invalid filter parameters provided'
  })
  findAll(
    @GetTenant() tenantId: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(50), ParseIntPipe) take?: number,
    @Query('contentTypeId', new DefaultValuePipe(undefined)) contentTypeIdStr?: string,
    @Query('authorId', new DefaultValuePipe(undefined)) authorIdStr?: string,
    @Query('parentId', new DefaultValuePipe(undefined)) parentIdStr?: string,
    @Query('accessType') accessType?: string
  ) {
    // Parse optional numeric parameters only if they're provided
    let contentTypeId: number | undefined
    let authorId: number | undefined
    let parentId: number | null | undefined

    // Only try to parse if values are provided
    if (contentTypeIdStr !== undefined) {
      const parsed = parseInt(contentTypeIdStr, 10)
      if (isNaN(parsed)) {
        throw new BadRequestException(`Invalid contentTypeId: ${contentTypeIdStr}`)
      }
      contentTypeId = parsed
    }

    if (authorIdStr !== undefined) {
      const parsed = parseInt(authorIdStr, 10)
      if (isNaN(parsed)) {
        throw new BadRequestException(`Invalid authorId: ${authorIdStr}`)
      }
      authorId = parsed
    }

    if (parentIdStr !== undefined) {
      // Special case: handle null for root content (parentId=null)
      if (parentIdStr.toLowerCase() === 'null') {
        parentId = null
      } else {
        const parsed = parseInt(parentIdStr, 10)
        if (isNaN(parsed)) {
          throw new BadRequestException(`Invalid parentId: ${parentIdStr}`)
        }
        parentId = parsed
      }
    }

    return this.contentService.findAll({
      skip,
      take,
      contentTypeId,
      authorId,
      parentId,
      accessType,
      tenantId
    })
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get content by ID',
    description: 'Retrieves a specific content item by its ID'
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Content item found'
  })
  @ApiResponse({
    status: 404,
    description: 'Content not found'
  })
  findOne(@Param('id', ParseIntPipe) id: number, @GetTenant() tenantId: number) {
    return this.contentService.findOne(id, tenantId)
  }

  @Get(':id/comments')
  @ApiOperation({
    summary: 'Get comments for content',
    description: 'Retrieves all comments associated with a specific content item'
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Parent content not found'
  })
  findComments(@Param('id', ParseIntPipe) id: number, @GetTenant() tenantId: number) {
    return this.contentService.findComments(id, tenantId)
  }

  @Get(':id/reactions')
  @ApiOperation({
    summary: 'Get reactions for content',
    description: 'Retrieves reaction counts and data for a specific content item'
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reactions retrieved successfully'
  })
  @ApiResponse({
    status: 404,
    description: 'Content not found'
  })
  findReactions(@Param('id', ParseIntPipe) id: number, @GetTenant() tenantId: number) {
    return this.contentService.findReactions(id, tenantId)
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update content',
    description: 'Updates a specific content item with the provided data'
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: Number })
  @ApiBody({ type: UpdateContentDto })
  @ApiResponse({
    status: 200,
    description: 'Content successfully updated'
  })
  @ApiResponse({
    status: 404,
    description: 'Content not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data provided'
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentDto: UpdateContentDto,
    @GetTenant() tenantId: number
  ) {
    return this.contentService.update(id, updateContentDto, tenantId)
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete content',
    description: 'Deletes a specific content item'
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Content successfully deleted'
  })
  @ApiResponse({
    status: 404,
    description: 'Content not found'
  })
  remove(@Param('id', ParseIntPipe) id: number, @GetTenant() tenantId: number) {
    return this.contentService.remove(id, tenantId)
  }

  @Post(':id/access/:userId')
  @ApiOperation({
    summary: 'Grant access to content',
    description: 'Grants specific access permissions to a user for a content item'
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: Number })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        accessType: {
          type: 'string',
          enum: Object.values(access_type),
          description: 'Type of access to grant'
        }
      },
      required: ['accessType']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Access successfully granted'
  })
  @ApiResponse({
    status: 404,
    description: 'Content or user not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid access type provided'
  })
  grantAccess(
    @Param('id', ParseIntPipe) contentId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body('accessType') accessType: string,
    @GetTenant() tenantId: number
  ) {
    if (!accessType) {
      throw new BadRequestException('accessType is required')
    }

    // Validate that the access type is valid
    const validAccessTypes = Object.values(access_type)
    const isValidAccessType = validAccessTypes.some((type) => type === accessType)

    if (!isValidAccessType) {
      throw new BadRequestException(
        `Invalid access type: ${accessType}. Valid types are: ${validAccessTypes.join(', ')}`
      )
    }

    return this.contentService.grantAccess(contentId, userId, accessType, tenantId)
  }

  @Delete(':id/access/:userId')
  @ApiOperation({
    summary: 'Revoke access to content',
    description: 'Removes access permissions for a user from a content item'
  })
  @ApiParam({ name: 'id', description: 'Content ID', type: Number })
  @ApiParam({ name: 'userId', description: 'User ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Access successfully revoked'
  })
  @ApiResponse({
    status: 404,
    description: 'Content, user, or access record not found'
  })
  revokeAccess(
    @Param('id', ParseIntPipe) contentId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @GetTenant() tenantId: number
  ) {
    return this.contentService.revokeAccess(contentId, userId, tenantId)
  }
}
