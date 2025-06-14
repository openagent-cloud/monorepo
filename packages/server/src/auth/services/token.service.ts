import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '../../utils/config/config.service'
import { user } from '@prisma/client'
import { v4 as uuid } from 'uuid'
import { PrismaService } from '../../utils/prisma/prisma.service'

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
  RESET_PASSWORD = 'reset'
}

export interface TokenPayload {
  sub: number
  username: string
  email: string
  role: string
  type: TokenType
  tenant_id?: number // Add tenant_id for multi-tenancy security
  jti?: string // JWT ID for token revocation tracking
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  // In-memory revoked token storage - in production, replace with Redis or database
  private revokedTokens: Map<string, number> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    // Cleanup expired tokens periodically
    if (!configService.isTest) {
      setInterval(() => this.cleanupRevokedTokens(), 1000 * 60 * 15); // 15 minutes
    }
  }

  generateAccessToken(user: user): string {
    const tokenId = uuid();
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      type: TokenType.ACCESS,
      tenant_id: user.tenant_id,
      jti: tokenId // JWT ID for revocation tracking
    }

    return this.jwtService.sign(payload, {
      expiresIn: '1h', // Hardcoded JWT expiration time to be consistent
      ...(this.configService.jwtIssuer && { issuer: this.configService.jwtIssuer }),
      ...(this.configService.jwtAudience && { audience: this.configService.jwtAudience })
    })
  }

  generateRefreshToken(user: user): string {
    const tokenId = uuid();
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      type: TokenType.REFRESH,
      tenant_id: user.tenant_id,
      jti: tokenId // JWT ID for revocation tracking
    }

    return this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh tokens last longer
      ...(this.configService.jwtIssuer && { issuer: this.configService.jwtIssuer }),
      ...(this.configService.jwtAudience && { audience: this.configService.jwtAudience })
    })
  }

  generateResetToken(user: user): string {
    const tokenId = uuid();
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      type: TokenType.RESET_PASSWORD,
      tenant_id: user.tenant_id,
      jti: tokenId // JWT ID for revocation tracking
    }

    return this.jwtService.sign(payload, {
      expiresIn: '24h', // Reset tokens expire in 24 hours
      ...(this.configService.jwtIssuer && { issuer: this.configService.jwtIssuer }),
      ...(this.configService.jwtAudience && { audience: this.configService.jwtAudience })
    })
  }

  verifyToken(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token)
  }

  decodeToken(token: string): TokenPayload {
    return this.jwtService.decode(token)
  }

  isTokenType(token: string, type: TokenType): boolean {
    try {
      const payload = this.verifyToken(token)
      return payload.type === type
    } catch {
      return false
    }
  }

  isAccessToken(token: string): boolean {
    return this.isTokenType(token, TokenType.ACCESS)
  }

  isRefreshToken(token: string): boolean {
    return this.isTokenType(token, TokenType.REFRESH)
  }

  isResetToken(token: string): boolean {
    return this.isTokenType(token, TokenType.RESET_PASSWORD)
  }
  
  /**
   * Revoke a token by its JWT ID
   * @param jti - JWT ID to revoke
   * @param expirationTime - When the token would expire naturally (in seconds since epoch)
   */
  revokeToken(jti: string, expirationTime?: number): void {
    // If no expiration provided, set default 24h from now
    const expiry = expirationTime || Math.floor(Date.now() / 1000) + 86400;
    this.revokedTokens.set(jti, expiry);
    this.logger.log(`Token revoked: ${jti} until ${new Date(expiry * 1000).toISOString()}`);
  }

  /**
   * Check if a token has been revoked
   * @param jti - JWT ID to check
   * @returns true if token is revoked, false otherwise
   */
  async isTokenRevoked(jti: string): Promise<boolean> {
    return this.revokedTokens.has(jti);
  }

  /**
   * Clean up expired revoked tokens from memory
   * In production, this should use Redis or database with TTL
   */
  cleanupRevokedTokens(): void {
    const now = Math.floor(Date.now() / 1000);
    let removed = 0;
    
    for (const [jti, expiry] of this.revokedTokens.entries()) {
      if (expiry < now) {
        this.revokedTokens.delete(jti);
        removed++;
      }
    }
    
    if (removed > 0) {
      this.logger.log(`Cleaned up ${removed} expired token revocations`);
    }
  }
}
