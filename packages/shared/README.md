# electric-stack-template/shared ⚡️

## Shared Template Repository

### For sake of saving time, for the greater good 🚀 [@tyzoo](https://github.com/tyzoo)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/tyzoo/electric-stack-template/issues)
[![Stars](https://img.shields.io/github/stars/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/stargazers)
[![Forks](https://img.shields.io/github/forks/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/network/members)
[![Issues](https://img.shields.io/github/issues/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/issues)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/tyzoo/electric-stack-template/)

Welcome to ElectricStack ⚡️, the official template repository for building local-first realtime applications

Shared package with Prisma schema, migrations, and common types for the electric-stack-template project.

> **Important Development Note:**
>
> In this project, **Docker Compose** is used to run the entire development stack. All services are running with hot reloading enabled when you use `make dev` from the root directory.
>
> The commands below are primarily for reference, or for use within the Docker Compose environment. Most database commands should be run using the Makefile commands from the root directory.

## Features

- Prisma schema and migrations
- Database seeding scripts
- Shared TypeScript types
- Environment variable management

## Environment Variables

The shared package requires certain environment variables to be set. You can create a `.env` file in the root of your project with the following variables:

```
# Database
DATABASE_URL="postgresql://electric:password@localhost:5432/electric?schema=public"

# Admin User Settings (used for seeding)
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_USERNAME="admin"
SUPER_ADMIN_NAME="Admin User"
SUPER_ADMIN_PASSWORD="securePassword123!"

# App Settings
APP_NAME="My Electric App"
APP_DESCRIPTION="A powerful app built with the Electric Stack"

# Environment
NODE_ENV="development"
```

### Environment Setup Script

For convenience, you can use the included setup script to generate a `.env` file with default values:

This script will create a `.env` file in the root directory with sensible defaults and a randomly generated password for the admin user.

### Environment Utility

This package provides a utility for accessing environment variables in a type-safe way:

```typescript
import { env } from 'shared'

// Access environment variables
const databaseUrl = env.DATABASE_URL
const isProduction = env.IS_PRODUCTION

// All environment variables are available in the env object
console.log(env.APP_NAME)
```

## Overview

The shared package centralizes all database-related code, including:

- Prisma schema
- Database migrations
- Type definitions
- Shared utilities

## Shared TypeScript Types

The shared package exports TypeScript types that can be used in both client and server packages:

1. **Prisma-generated types**: These are automatically created when running `prisma generate`.
2. **Manually defined types**: In index.ts for cases where you need types before Prisma generation.

These types are properly exported to be used by other packages in the monorepo.

## Usage

### Prisma Client

```typescript
import { prisma, User } from 'shared'

// Use Prisma client
const users = await prisma.user.findMany()

// TypeScript types are also available
const user: User = users[0]
```

### From client (React)

```typescript
// Import the types (client can't use the Prisma client directly)
import type { user, token } from 'shared'
import { useState } from 'react'

// Use the types in your components
function UserProfile({ userData }: { userData: user }) {
  return <div>{userData.name}</div>
}

// In your data fetching
const [users, setUsers] = useState<user[]>([])
```

## Commands

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to the database
npm run db:push

# Run migrations
npm run db:migrate

# Deploy migrations in production
npm run db:migrate:deploy

# Reset database (caution: deletes all data)
npm run db:reset

# Open Prisma Studio UI
npm run db:studio

# Seed the database with initial data
npm run db:seed
```

> **Note:** For most database operations, prefer using the Makefile commands from the root directory, as they are configured to work with the Docker Compose environment.

### Build Commands

```bash
# Build the package
npm run build

# Clean build artifacts
npm run clean
```

## Conventions

### Prisma Schema

- Define all database models in `prisma/schema.prisma`
- Use meaningful names for models and fields
- Add JSDoc comments for complex fields
- Define clear relationships between models
- Use enums for fields with a fixed set of values

### TypeScript Types

- Mirror Prisma models with TypeScript interfaces
- Export all types needed by client and server
- Use type-safety for all database operations
- Define shared DTOs for API communication
- Provide fallbacks when Prisma types aren't generated

### Environment Variables

- Define environment variables in the root `.env` file
- Access environment variables through the `env` utility
- Provide sensible defaults for development
- Validate required environment variables
- Document all environment variables in README

### Seed Data

- Organize seed data in logical modules
- Ensure idempotent seeding operations
- Use transactions for seed operations
- Implement proper error handling
- Provide clear console output during seeding
