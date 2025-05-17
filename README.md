# electric-stack-template ⚡️

## Full Stack Template Repository

### For sake of saving time, for the greater good 🚀 [@tyzoo](https://github.com/tyzoo)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/tyzoo/electric-stack-template/issues)
[![Stars](https://img.shields.io/github/stars/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/stargazers)
[![Forks](https://img.shields.io/github/forks/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/network/members)
[![Issues](https://img.shields.io/github/issues/tyzoo/electric-stack-template.svg)](https://github.com/tyzoo/electric-stack-template/issues)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/tyzoo/electric-stack-template/)

Welcome to ElectricStack ⚡️, the official template repository for building local-first realtime applications with:

- **PostgreSQL** database
- **Prisma** database ORM and migrations
- **ElectricSQL** real-time data sync and local-first data management via PGLite
- **Caddy**: HTTP/2 reverse proxy for electric - improves performance
- **NestJS Server** (TypeScript backend) for the backend API, @tanstack/query, swagger-ui (at root /) at `/server`
- **Vite React Client** (TypeScript frontend) at `/client`
- **Shared Package** with Prisma schemas, migrations, and shared types at `/shared`
- **Modern developer tooling**: Makefile automation, ESLint, Prettier
- **Docker Compose** for orchestrating the local hot-reload dev stack

## Project Structure

```
packages/
├── client/       # React frontend
├── server/       # NestJS backend API
└── shared/       # Shared package with Prisma schema, migrations, common types
```

For detailed information about each package, check out their README files:

- [Client Documentation](packages/client/README.md)
- [Server Documentation](packages/server/README.md)
- [Shared Documentation](packages/shared/README.md)

> **Note:**
>
> - **Docker Compose** is the primary orchestrator for running, integrating, and centralizing logs for all services (`docker compose logs -f`). Use it to start, stop, and monitor your full stack in one place.
> - **Turborepo** is used for code quality, build, and test tasks across the monorepo (e.g., linting, formatting, building), but not for running the actual services. Use it to keep your codebase fast, consistent, and maintainable.

## **Getting Started:**

- **Install local dependencies in all packages:**
  ```sh
  npm install
  ```
- **Start the entire local Docker compose developer stack:**
  ```sh
  make dev
  ```

## **Usage:**

- `make logs` - View Docker compose application logs
- `npm run build` - Build Server, Client and Shared packages
- `make build` - Build entire Docker compose
- `make down` - Stop all services
- `make down-v` - Stop all services and remove volumes

See the Makefile for more automation commands (migrations, Prisma, seeding, env management, etc).
