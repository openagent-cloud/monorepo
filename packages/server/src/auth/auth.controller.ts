import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthGuard } from './guards/auth.guard'
import { JwtOnly } from './decorators/auth-decorators'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { PasswordResetRequestDto } from './dto/password-reset-request.dto'
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login with username/email and password',
    description:
      'Authenticate user and return access token. Accepts either email or username as identifier.'
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            name: { type: 'string' },
            avatar_url: { type: 'string' }
          }
        },
        access_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials'
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account with username, email, and password'
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        },
        access_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - email or username already exists'
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto)
  }

  @UseGuards(AuthGuard)
  @JwtOnly()
  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns information about the currently authenticated user'
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      properties: {
        id: { type: 'number' },
        username: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        name: { type: 'string' },
        avatar_url: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token'
  })
  getProfile(@Request() req) {
    return req.user
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Use refresh token to get a new access token'
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token'
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto)
  }

  @Post('reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Request a password reset link sent to email'
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async requestPasswordReset(@Body() resetRequestDto: PasswordResetRequestDto) {
    return this.authService.requestPasswordReset(resetRequestDto)
  }

  @Post('reset-password/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm password reset',
    description: 'Reset password using token from email'
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired token'
  })
  async confirmPasswordReset(@Body() confirmResetDto: PasswordResetConfirmDto) {
    return this.authService.resetPassword(confirmResetDto)
  }
}
