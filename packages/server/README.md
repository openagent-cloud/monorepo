# electric-stack-template/server ⚡️

## Server Template Repository

### For sake of saving time, for the greater good 🚀 [@tyzoo](https://github.com/tyzoo)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/tyzoo/electric-stack-template/issues)
[![Stars](https://img.shields.io/github/stars/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/stargazers)
[![Forks](https://img.shields.io/github/forks/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/network/members)
[![Issues](https://img.shields.io/github/issues/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/issues)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/tyzoo/electric-stack-template/)

Welcome to ElectricStack ⚡️, the official template repository for building local-first realtime applications

Backend NestJS API server for the electric-stack-template project.

## Usage

For complete documentation and stack commands, see the [root README.md](../../README.md).

## Server-Specific Development

### Local Development

```bash
# Start just the server in development mode
npm run dev

# Lint code
npm run lint

# Format code
npm run format
```

### Tech Stack

- **NestJS** - Server framework
- **Prisma** - Database ORM
- **Zod** - Schema validation
- **ElectricSQL** - Real-time sync

### Directory Structure

```
/src               # Source code
  /config          # Configuration files
  /controllers     # API controllers
  /services        # Business logic
  /dto             # Data transfer objects
  /entities        # Prisma entities/models
  /middleware      # Custom middleware
  main.ts          # Entry point
```

## Conventions

### API Structure

- Use NestJS controllers for defining API endpoints
- Use services for business logic
- Keep controllers thin, with minimal logic
- Use DTOs for input/output validation

### Error Handling

- Use NestJS exception filters for consistent error responses
- Throw specific exceptions rather than returning error objects
- Use Zod for validation with clear error messages

### Database Access

- Use the shared Prisma client from `shared` package
- Use transactions for related operations
- Keep database queries in service layer
- Follow repository pattern for complex database operations

### Authentication & Authorization

- Use Guards for protecting routes
- Implement role-based access control
- Keep authentication logic in dedicated services
- Use dependency injection for security services
