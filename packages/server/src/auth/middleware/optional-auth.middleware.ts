import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { TokenService } from '../services/token.service'
import { PrismaService } from '../../utils/prisma/prisma.service'

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7, authHeader.length)

      try {
        // Verify this is an access token
        if (!this.tokenService.isAccessToken(token)) {
          // Continue without user if not an access token
          return next()
        }

        const payload = this.tokenService.verifyToken(token)

        // Find user without returning password
        const user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            name: true,
            avatar_url: true,
            is_verified: true
          }
        })

        if (user) {
          // Attach user to request object but don't require auth
          req['user'] = user
        }
      } catch {
        // If token is invalid, just continue without user
        // No error is thrown since this is optional auth
      }
    }

    next()
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
