# ElectricSQL Caddy Proxy with JWT Authentication

This directory contains the configuration for a Caddy server that acts as a secure HTTP/2 proxy in front of ElectricSQL. The proxy implements JWT-based authentication and authorization for ElectricSQL shape requests.

## Configuration Overview

The `Caddyfile` in this directory configures Caddy to:

1. **Authenticate requests** using JWT tokens
2. **Authorize access to ElectricSQL shapes** based on claims in the JWT token
3. **Proxy authorized requests** to the ElectricSQL service
4. **Reject unauthorized requests** with appropriate HTTP status codes

## JWT Authentication Details

The JWT authentication is configured to:

- Use HMAC-SHA256 (HS256) algorithm for token validation
- Extract shape-specific claims from the token for authorization
- Match shape definitions in the token against requested shapes

## Shape Authorization

The proxy implements a powerful authorization mechanism that:

1. Extracts shape information from JWT claims:
   - `shape.namespace`
   - `shape.table`
   - `shape.where`
   - `shape.columns`

2. Compares these claims against the request parameters using Common Expression Language (CEL)

3. Only allows access to shapes that exactly match what's defined in the token

## Environment Variables

The Caddyfile uses the following environment variables:

- `CADDY_PORT`: The port on which Caddy listens
- `JWT_SECRET`: The secret key used to validate JWT tokens (base64 encoded)
- `ELECTRIC_URL`: The URL of the ElectricSQL service (defaults to "http://localhost:3000")
- `ELECTRIC_SECRET`: The secret key used for secure communication with ElectricSQL

## Security Benefits

This configuration provides several security advantages:

1. **Controlled Access**: Only authenticated users can access ElectricSQL shapes
2. **Fine-grained Authorization**: Users can only access the specific shapes defined in their tokens
3. **HTTP/2 Performance**: Maintains the performance benefits of HTTP/2 for multiple concurrent connections
4. **Token-based Authentication**: Integrates with existing authentication systems

## Usage Example

To use this proxy:

1. Generate a JWT token with shape claims that define what tables/data the user can access
2. Include this token in API requests to the Caddy proxy
3. The proxy will validate the token and only allow access to matching shapes

For more details on JWT token generation and usage, refer to the ElectricSQL documentation.
