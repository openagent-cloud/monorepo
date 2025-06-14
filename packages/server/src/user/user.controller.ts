import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { UserService } from './user.service'
import { UpdateUserSettingsDto, UserSettingsResponseDto } from './dto/user-settings.dto'
import { AuthGuard } from '../auth/guards/auth.guard'
import { JwtOnly, RequireModules } from '../auth/decorators/auth-decorators'
import { module } from '@prisma/client'

@ApiTags('User Settings')
@Controller('user')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@JwtOnly()
@RequireModules(module.users)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current user settings',
    description: 'Retrieve the settings/profile information for the currently authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'User settings retrieved successfully',
    type: UserSettingsResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token'
  })
  async getCurrentUserSettings(@Request() req): Promise<UserSettingsResponseDto> {
    const userId = req.user.id
    const userRole = req.user.role
    const tenantId = req.user.tenantId

    return this.userService.getUserSettings(userId, userId, userRole, tenantId)
  }

  @Post('settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update current user settings',
    description: 'Update the settings/profile information for the currently authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'User settings updated successfully',
    type: UserSettingsResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token'
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - username or email already exists'
  })
  async updateCurrentUserSettings(
    @Request() req,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto
  ): Promise<UserSettingsResponseDto> {
    const userId = req.user.id
    const userRole = req.user.role
    const tenantId = req.user.tenantId

    return this.userService.updateUserSettings(
      userId,
      updateUserSettingsDto,
      userId,
      userRole,
      tenantId
    )
  }

  @Get(':userId/settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user settings by ID (Admin only)',
    description: 'Retrieve settings for any user by ID. Only accessible by admins and superadmins.'
  })
  @ApiResponse({
    status: 200,
    description: 'User settings retrieved successfully',
    type: UserSettingsResponseDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async getUserSettings(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req
  ): Promise<UserSettingsResponseDto> {
    const requestingUserId = req.user.id
    const requestingUserRole = req.user.role
    const tenantId = req.user.tenantId

    return this.userService.getUserSettings(userId, requestingUserId, requestingUserRole, tenantId)
  }

  @Post(':userId/settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user settings by ID (Admin only)',
    description: 'Update settings for any user by ID. Only accessible by admins and superadmins.'
  })
  @ApiResponse({
    status: 200,
    description: 'User settings updated successfully',
    type: UserSettingsResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - username or email already exists'
  })
  async updateUserSettings(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto
  ): Promise<UserSettingsResponseDto> {
    const requestingUserId = req.user.id
    const requestingUserRole = req.user.role
    const tenantId = req.user.tenantId

    return this.userService.updateUserSettings(
      userId,
      updateUserSettingsDto,
      requestingUserId,
      requestingUserRole,
      tenantId
    )
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user account',
    description:
      'Delete a user account. Users can delete their own account, admins can delete any account.'
  })
  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'User account deleted successfully' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req
  ): Promise<{ message: string }> {
    const requestingUserId = req.user.id
    const requestingUserRole = req.user.role
    const tenantId = req.user.tenantId

    return this.userService.deleteUser(userId, requestingUserId, requestingUserRole, tenantId)
  }

  @Delete('settings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete current user account',
    description: 'Delete the currently authenticated user account'
  })
  @ApiResponse({
    status: 200,
    description: 'User account deleted successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'User account deleted successfully' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token'
  })
  async deleteCurrentUser(@Request() req): Promise<{ message: string }> {
    const userId = req.user.id
    const userRole = req.user.role
    const tenantId = req.user.tenantId

    return this.userService.deleteUser(userId, userId, userRole, tenantId)
  }
}
