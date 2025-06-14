import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport'
import { PrismaService } from '../../utils/prisma/prisma.service'
import { module, user_role } from '@prisma/client'
import { 
  IS_PUBLIC_KEY, 
  JWT_ONLY_KEY, 
  ROLES_KEY, 
  REQUIRED_MODULE_KEY 
} from '../decorators/auth-decorators'

/**
 * THE ONE TRUE GUARD - handles all authentication and authorization
 * 
 * Features:
 * - Public routes (@Public decorator)
 * - JWT auth with API Key fallback
 * - JWT-only enforcement (@JwtOnly decorator)
 * - Role-based access (@Roles decorator)
 * - Module permissions (@RequireModule decorator)
 * - Hierarchical permissions (tenant+user module checks)
 * - Superadmin bypasses all permission checks
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    // 2. Handle authentication (JWT or API key)
    let jwtSuccess = false
    let apiKeySuccess = false

    // Check if API keys are not allowed (JWT only)
    const isJwtOnly = this.reflector.getAllAndOverride<boolean>(JWT_ONLY_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    // Try JWT authentication first
    try {
      // Direct AuthGuard usage - no separate guard needed!
      const jwtAuthGuard = new (PassportAuthGuard('jwt'))();
      jwtSuccess = await jwtAuthGuard.canActivate(context) as boolean;
      
      // Extract user from the JWT
      await jwtAuthGuard.logIn(context.switchToHttp().getRequest());
    } catch (jwtError) {
      // JWT auth failed, will try API key if allowed
      if (isJwtOnly) {
        throw new UnauthorizedException('JWT authentication required')
      }
    }

    // If JWT fails and API keys are allowed, try that
    if (!jwtSuccess && !isJwtOnly) {
      try {
        // Direct AuthGuard usage - no separate guard needed!
        const apiKeyAuthGuard = new (PassportAuthGuard('api-key'))();
        apiKeySuccess = await apiKeyAuthGuard.canActivate(context) as boolean;
        
        // Extract user from the API key auth
        await apiKeyAuthGuard.logIn(context.switchToHttp().getRequest());
      } catch (apiKeyError) {
        // API Key auth failed too
      }
    }

    // If neither auth method succeeded, deny access
    if (!jwtSuccess && !apiKeySuccess) {
      throw new UnauthorizedException('Authentication required')
    }

    // At this point, authentication succeeded (either JWT or API key)
    // Now we check authorization - module permissions and roles

    // 3. Get the authenticated user
    const request = context.switchToHttp().getRequest()
    const userId = request.user?.id
    
    if (!userId) {
      throw new ForbiddenException('User ID not found in request')
    }

    // 4. Check what permissions are required for this route
    const requiredModules = this.reflector.getAllAndOverride<module[]>(REQUIRED_MODULE_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    // If no special permissions are required, allow access
    if ((!requiredModules || requiredModules.length === 0) && !requiredRoles?.length) {
      return true
    }

    // 5. Fetch user with tenant for permission checks
    const userWithModules = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tenant: true }
    })

    if (!userWithModules) {
      throw new ForbiddenException('User not found')
    }

    // 6. Superadmins bypass all permission checks
    if (userWithModules.role === user_role.superadmin) {
      return true
    }

    // 7. Check module permissions if required
    if (requiredModules && requiredModules.length > 0) {
      // Check if user has ALL required modules
      for (const mod of requiredModules) {
        const hasUserPermission = userWithModules.modules.includes(mod)
        const hasTenantPermission = userWithModules.tenant.modules.includes(mod)

        if (!hasUserPermission || !hasTenantPermission) {
          throw new ForbiddenException(`Access to module '${mod}' denied`)
        }
      }
    }

    // 8. Check role permission if required
    if (requiredRoles?.length) {
      const hasRequiredRole = requiredRoles.includes(userWithModules.role.toString())
      
      if (!hasRequiredRole) {
        throw new ForbiddenException(`Required role not met: ${requiredRoles.join(' or ')}`)
      }
    }

    // All checks passed!
    return true
  }
}
