import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '../utils/config/config.service'
import { PrismaService } from '../utils/prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { PasswordResetRequestDto } from './dto/password-reset-request.dto'
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto'
import { TokenService } from './services/token.service'
import { CryptoService } from './services/crypto.service'
import { user } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private cryptoService: CryptoService
  ) {}

  private async validateUser(identifier: string, password: string): Promise<user> {
    // Find user by email or username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }]
      }
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }

  private generateTokens(user: user) {
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = this.tokenService.generateRefreshToken(user)

    return { accessToken, refreshToken }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto

    // Verify the token is a valid refresh token
    if (!this.tokenService.isRefreshToken(refresh_token)) {
      throw new UnauthorizedException('Invalid refresh token type')
    }

    // Extract user ID from token
    try {
      const decoded = this.tokenService.decodeToken(refresh_token)
      const userId = decoded.sub

      // Get user from database
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      // Generate new tokens
      const { accessToken, refreshToken } = this.generateTokens(user)

      return {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async requestPasswordReset(passwordResetRequestDto: PasswordResetRequestDto) {
    const { identifier } = passwordResetRequestDto

    // Find user by email or username
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }]
      }
    })

    if (!user) {
      // Don't reveal that the email doesn't exist for security reasons
      return { message: 'If the email exists, a reset link has been sent' }
    }

    // Generate reset token
    const resetToken = this.tokenService.generateResetToken(user)

    // Get frontend URL from config or use default localhost
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'

    // Construct the reset password URL that matches our frontend route
    const resetUrl = `${frontendUrl}/reset-password/confirm/${resetToken}`

    // In a real application, you would send an email here with the reset link
    // For development, we'll just return the token and URL directly
    if (this.configService.nodeEnv === 'development') {
      return {
        message: 'Reset token generated successfully',
        resetToken, // The raw token
        resetUrl // The complete URL for the frontend
      }
    }

    // TODO: Implement email sending with the resetUrl

    return { message: 'If the email exists, a reset link has been sent' }
  }

  async resetPassword(passwordResetConfirmDto: PasswordResetConfirmDto) {
    const { token, password } = passwordResetConfirmDto

    // Verify this is a reset token
    if (!this.tokenService.isResetToken(token)) {
      throw new UnauthorizedException('Invalid reset token type')
    }

    try {
      // Decode the token to get the user ID
      const decoded = this.tokenService.decodeToken(token)
      const userId = decoded.sub

      // Find the user
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Update user password
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword
        }
      })

      return { message: 'Password reset successful' }
    } catch {
      throw new UnauthorizedException('Invalid reset token')
    }
  }

  async updateProfile(userId: number, data: Record<string, string>) {
    // Ensure user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    // Generate new keypair if requested
    if (data.regenerate_keys === 'true') {
      const { publicKey, privateKey } = this.cryptoService.generateKeyPair()
      data.public_key = publicKey
      data.private_key = privateKey
      delete data.regenerate_keys
    }

    // Never allow direct setting of private_key through API
    if ('private_key' in data && data.regenerate_keys !== 'true') {
      delete data.private_key
    }

    if (!user) {
      throw new NotFoundException('User not found')
    }

    // If updating email or username, check for uniqueness
    if (data.email || data.username) {
      const conditions: { email?: string; username?: string }[] = []

      if (data.email) {
        conditions.push({ email: data.email })
      }

      if (data.username) {
        conditions.push({ username: data.username })
      }

      const existingUser =
        conditions.length > 0
          ? await this.prisma.user.findFirst({
              where: {
                OR: conditions,
                NOT: { id: userId }
              }
            })
          : null

      if (existingUser) {
        if (data.email && existingUser.email === data.email) {
          throw new ConflictException('Email already in use')
        }
        if (data.username && existingUser.username === data.username) {
          throw new ConflictException('Username already taken')
        }
      }
    }

    // If updating password, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10)
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        name: true,
        avatar_url: true,
        is_verified: true,
        public_key: true
        // private_key intentionally excluded
      }
    })

    return updatedUser
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.identifier, loginDto.password)

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user)

    // Update user with last login time
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        last_login: new Date()
      }
    })

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar_url: user.avatar_url,
        public_key: user.public_key
        // Note: private_key is intentionally excluded for security
      },
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }

  async register(registerDto: RegisterDto) {
    // Check if user with email or username already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: registerDto.email }, { username: registerDto.username }]
      }
    })

    if (existingUser) {
      if (existingUser.email === registerDto.email) {
        throw new ConflictException('Email already in use')
      } else {
        throw new ConflictException('Username already taken')
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    // Generate secp256k1 keypair
    const { publicKey, privateKey } = this.cryptoService.generateKeyPair()

    // Create user
    const newUser = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        name: registerDto.name,
        last_login: new Date(),
        public_key: publicKey,
        private_key: privateKey,
        tenant: {
          connect: { id: registerDto.tenant_id } // Connect to the specified tenant
        }
      }
    })

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(newUser)

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        public_key: publicKey // Include public key in response
        // Note: private_key is intentionally excluded for security
      },
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }
}
