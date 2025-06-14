import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import {
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException
} from '@nestjs/common'
import { ConfigService } from '../../utils/config/config.service'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { TokenService, TokenType, TokenPayload } from '../services/token.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name)

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private tokenService: TokenService
  ) {
    // Ensure JWT secret is configured
    const jwtSecret = configService.jwtSecret
    if (!jwtSecret) {
      throw new InternalServerErrorException(
        'JWT_SECRET is not configured. This is a critical security issue.'
      )
    }

    // Initialize PassportStrategy with JWT options
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      // Add issuer and audience if configured
      ...(configService.jwtIssuer && { issuer: configService.jwtIssuer }),
      ...(configService.jwtAudience && { audience: configService.jwtAudience })
    })

    // Now it's safe to use 'this' after the super() call
    this.logger.log('JWT strategy initialized with proper configuration')
  }

  async validate(payload: TokenPayload) {
    try {
      // Verify this is an access token
      if (payload.type !== TokenType.ACCESS) {
        this.logger.warn(`Invalid token type: ${payload.type}`)
        throw new UnauthorizedException('Invalid token type')
      }

      // Check if token has been revoked
      // Note: Implement tokenService.isTokenRevoked if it doesn't exist
      if (payload.jti && this.tokenService.isTokenRevoked) {
        const isRevoked = await this.tokenService.isTokenRevoked(payload.jti)
        if (isRevoked) {
          this.logger.warn(`Revoked token used: ${payload.jti}`)
          throw new UnauthorizedException('Token has been revoked')
        }
      }

      // Fetch user with tenant information
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          name: true,
          avatar_url: true,
          tenant_id: true
        }
      })

      if (!user) {
        this.logger.warn(`User not found: ${payload.sub}`)
        throw new UnauthorizedException('User not found')
      }

      // Verify tenant_id matches if present in token
      if (payload.tenant_id && payload.tenant_id !== user.tenant_id) {
        this.logger.warn(`Tenant mismatch: token=${payload.tenant_id}, user=${user.tenant_id}`)
        throw new UnauthorizedException('Invalid tenant access')
      }

      // Return user with tenant_id for downstream authorization
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id
      }
    } catch (error) {
      // Log but don't expose internal errors
      if (!(error instanceof UnauthorizedException)) {
        this.logger.error(`JWT validation error: ${error.message}`, error.stack)
        throw new UnauthorizedException('Authentication failed')
      }
      throw error
    }
  }
}
