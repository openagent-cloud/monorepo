import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger'
import { ContactService } from './contact.service'
import { CreateContactDto } from './dto/create-contact.dto'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { Roles } from '../../auth/decorators/auth-decorators'
import { JwtOnly, RequireModules } from '../../auth/decorators/auth-decorators'
import { module } from '@prisma/client'

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit contact message',
    description: 'Create a new contact form submission with user details and message'
  })
  @ApiBody({ type: CreateContactDto, description: 'Contact form details' })
  @ApiResponse({ status: 201, description: 'Contact message created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid contact form data' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto)
  }

  @Get()
  @UseGuards(AuthGuard)
  @JwtOnly()
  @RequireModules(module.contact)
  @Roles('admin', 'superadmin', 'moderator')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all contact messages',
    description: 'Retrieve all contact messages, sorted by creation date (Admin/Moderator only)'
  })
  @ApiResponse({ status: 200, description: 'List of contact messages returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin or moderator role' })
  findAll(@Query('tenantId') tenantId: number, @Query('category') optionalCategory?: string) {
    return this.contactService.findAll(tenantId, optionalCategory)
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @JwtOnly()
  @RequireModules(module.contact)
  @Roles('admin', 'superadmin', 'moderator')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get contact message by ID',
    description: 'Retrieve a specific contact message by its ID (Admin/Moderator only)'
  })
  @ApiParam({ name: 'id', description: 'Contact message ID', type: Number })
  @ApiResponse({ status: 200, description: 'Contact message returned successfully' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin or moderator role' })
  findOne(@Query('tenantId') tenantId: number, @Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(tenantId, id)
  }

  @Put(':id/status/:status')
  @UseGuards(AuthGuard)
  @JwtOnly()
  @RequireModules(module.contact)
  @Roles('admin', 'superadmin', 'moderator')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update message status',
    description: 'Update the status of a contact message (new, read, responded, archived, etc)'
  })
  @ApiParam({ name: 'id', description: 'Contact message ID', type: Number })
  @ApiParam({
    name: 'status',
    description: 'New status value',
    enum: ['new', 'read', 'responded', 'archived']
  })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 400, description: 'Invalid status value' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin or moderator role' })
  updateStatus(
    @Query('tenantId') tenantId: number,
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: string
  ) {
    return this.contactService.updateStatus(tenantId, id, status)
  }
}
