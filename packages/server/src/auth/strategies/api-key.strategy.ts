import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-custom'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { user_role } from '@prisma/client'

/**
 * API Key authentication strategy
 * 
 * Validates API keys from the Authorization header against stored API keys in the database
 * If valid, attaches the associated user to the request object
 */
@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private readonly prisma: PrismaService) {
    super()
  }

  async validate(req: any) {
    try {
      // Extract API key from Authorization header
      const authHeader = req.headers.authorization
      
      if (!authHeader || !authHeader.startsWith('ApiKey ')) {
        throw new UnauthorizedException('API key is missing or invalid format')
      }
      
      const apiKey = authHeader.substring(7) // Remove 'ApiKey ' prefix

      // Look up the tenant directly by API key
      const tenant = await this.prisma.tenant.findUnique({
        where: {
          api_key: apiKey
        },
        select: {
          id: true,
          modules: true
        }
      })

      // If no tenant found with this API key, deny access
      if (!tenant) {
        throw new UnauthorizedException('Invalid API key')
      }

      // Set up a user object with tenant info for permission checks
      // API key users get admin role within the tenant context
      const user = {
        id: 0, // API key doesn't correspond to a specific user
        role: user_role.admin, // API keys get admin access within their tenant
        tenant: {
          id: tenant.id,
          modules: tenant.modules
        },
        modules: tenant.modules // API key has access to all tenant modules
      }

      return user
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'API key validation failed'
      )
    }
  }
}
