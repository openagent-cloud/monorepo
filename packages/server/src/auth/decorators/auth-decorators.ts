import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common'
import { module, user_role } from '@prisma/client'

/**
 * ALL AUTH DECORATORS CONSOLIDATED HERE
 *
 * This file contains all decorators related to authentication and authorization
 * to make them easier to find and use throughout the application.
 */

// Public routes (no auth required)
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

// JWT only routes (no API key fallback)
export const JWT_ONLY_KEY = 'jwtOnly'
export const JwtOnly = () => SetMetadata(JWT_ONLY_KEY, true)

// Role-based access control
export const ROLES_KEY = 'roles'
export const Roles = (...roles: user_role[]) => SetMetadata(ROLES_KEY, roles)

// Module permissions
export const REQUIRED_MODULE_KEY = 'required-module'
export const RequireModules = (...modules: module[]) => SetMetadata(REQUIRED_MODULE_KEY, modules)

// Legacy support for single module requirement
export const RequireModule = (mod: module) => RequireModules(mod)

// Tenant utilities (might be needed elsewhere)
export const TENANT_KEY = 'tenant'
export const Tenant = () => SetMetadata(TENANT_KEY, true)

export const GetTenant = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user

  // If no tenant available on user, return null
  if (!user?.tenant?.id) {
    return null
  }

  return user.tenant.id
})
