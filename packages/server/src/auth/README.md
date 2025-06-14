# 🔒 Auth System

## The One True Guard™

We've **AGGRESSIVELY CONSOLIDATED** all authentication and authorization into a single, unified guard that handles:

1. **Authentication Methods**

   - JWT authentication
   - API Key authentication (with fallback)
   - Public routes (no auth)

2. **Authorization Controls**
   - Role-based access control
   - Module-based permissions
   - Hierarchical tenant+user module permission checks
   - Superadmin bypass for all permissions

## Decorators

Use these decorators from `auth/decorators/auth-decorators.ts`:

```typescript
// Public route - no authentication required
@Public()

// JWT only - no API key fallback allowed
@JwtOnly()

// Required role(s) - must have one of these roles
@Roles('admin', 'manager')

// Required module - must have this module enabled
@RequireModule(module.content)
```

## How It Works

1. Request hits a controller/endpoint
2. Guard checks if route is public with `@Public()` decorator
3. If not public:
   - Tries JWT authentication first
   - If JWT fails and not `@JwtOnly()`, tries API key
   - If both fail, returns 401 Unauthorized
4. After authentication succeeds:
   - Checks module permissions if `@RequireModule()` used
   - Checks roles if `@Roles()` used
   - Superadmins bypass all permission checks
   - Otherwise both tenant AND user must have module permissions

## Usage Example

```typescript
import { Controller, Get } from '@nestjs/common'
import { Public, RequireModule, Roles, JwtOnly } from '../auth/decorators/auth-decorators'
import { AuthGuard } from '../auth/guards/auth.guard'
import { module } from '@prisma/client'
import { UseGuards } from '@nestjs/common'

@Controller('example')
@UseGuards(AuthGuard) // Apply guard to all routes in controller
export class ExampleController {
  @Get('public')
  @Public() // No auth needed
  getPublicData() {
    return { message: 'This is public' }
  }

  @Get('secure')
  // No decorators = basic auth required, but no special permissions
  getSecureData() {
    return { message: 'Authenticated user can access this' }
  }

  @Get('admin-only')
  @Roles('admin') // Only admins can access
  getAdminData() {
    return { message: 'Admin only data' }
  }

  @Get('content')
  @RequireModule(module.content) // Requires content module access
  getContentData() {
    return { message: 'Content module data' }
  }

  @Get('jwt-only')
  @JwtOnly() // Only JWT auth, no API key fallback
  getJwtOnlyData() {
    return { message: 'JWT only data' }
  }
}
```

## Security Notes

- Always use the `AuthGuard` on your controllers
- Add `@RequireModule()` for module-specific endpoints
- Add `@Roles()` for role-restricted endpoints
- Use `@Public()` sparingly for truly public routes
- Use `@JwtOnly()` for especially sensitive endpoints where API keys shouldn't work
