import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger'
import { MailingListService } from './mailing-list.service'
import { SubscribeDto } from './dto/subscribe.dto'
import { AuthGuard } from '../../auth/guards/auth.guard'
import { Roles } from '../../auth/decorators/auth-decorators'
import { JwtOnly, RequireModules } from '../../auth/decorators/auth-decorators'
import { module } from '@prisma/client'

@ApiTags('Mailing List')
@Controller('mailing-list')
export class MailingListController {
  constructor(private readonly mailingListService: MailingListService) {}

  @Post('subscribe')
  @ApiOperation({
    summary: 'Subscribe to mailing list',
    description: 'Add an email address to the mailing list with optional metadata'
  })
  @ApiBody({ type: SubscribeDto, description: 'Email subscription details' })
  @ApiResponse({ status: 201, description: 'Successfully subscribed to mailing list' })
  @ApiResponse({ status: 400, description: 'Invalid email or subscription data' })
  subscribe(@Body() subscribeDto: SubscribeDto) {
    return this.mailingListService.subscribe(subscribeDto)
  }

  //TODO: this should confirm some uuid of a message they received rather than leaving it public
  @Delete('unsubscribe/:email')
  @ApiOperation({
    summary: 'Unsubscribe from mailing list',
    description: 'Remove an email address from active subscribers'
  })
  @ApiParam({ name: 'email', description: 'Email address to unsubscribe' })
  @ApiResponse({ status: 200, description: 'Successfully unsubscribed from mailing list' })
  @ApiResponse({ status: 404, description: 'Email not found in mailing list' })
  unsubscribe(@Query('tenantId') tenantId: number, @Param('email') email: string) {
    return this.mailingListService.unsubscribe(tenantId, email)
  }

  @Get()
  @UseGuards(AuthGuard)
  @JwtOnly()
  @RequireModules(module.mailing_list)
  @Roles('admin', 'superadmin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all subscribers',
    description: 'Retrieve complete list of active subscribers (Admin only)'
  })
  @ApiResponse({ status: 200, description: 'List of subscribers returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid credentials' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  getAllSubscribers(@Query('tenantId') tenantId: number) {
    return this.mailingListService.getAllSubscribers(tenantId)
  }
}
