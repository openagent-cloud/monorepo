import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Custom decorator that extracts the tenant API key from either:
 * 1. x-api-key header
 * 2. Bearer token in Authorization header
 * 
 * @throws UnauthorizedException if no API key is found
 * @returns The extracted tenant API key
 */
// Extract API key from request
export function extractApiKey(request: any): string {
  // Try to get API key from x-api-key header
  let apiKey = request.headers['x-api-key'];

  // If not found, try to get from Authorization header as Bearer token
  if (!apiKey && request.headers.authorization) {
    const authHeader = request.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7);
    }
  }

  if (!apiKey) {
    throw new UnauthorizedException('API key is required (provide via x-api-key header or Bearer token)');
  }

  return apiKey;
}

export const ApiKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return extractApiKey(request);
  },
);

/**
 * Extract admin key from request
 * @param request The HTTP request object
 * @throws UnauthorizedException if no admin key is found
 * @returns The extracted admin API key
 */
export function extractAdminKey(request: any): string {
  const adminKey = request.headers['x-admin-key'];

  if (!adminKey) {
    throw new UnauthorizedException('Admin key is required');
  }

  return adminKey;
}

/**
 * Decorator to extract admin API key from request headers
 * @throws UnauthorizedException if no admin key is found
 * @returns The extracted admin API key
 */
export const AdminKey = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return extractAdminKey(request);
  },
);
