# ⚡️ [openagent.cloud](https://openagent.cloud) monorepo

## Full Stack Developer Tool Bench

> **From the founder:** A collection of my personal experiments released here for the sake of saving time, and for the greater good 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/openagent-cloud/monorepo/issues)
[![Stars](https://img.shields.io/github/stars/openagent-cloud/monorepo.svg)](https://github.com/openagent-cloud/monorepo/stargazers)
[![Forks](https://img.shields.io/github/forks/openagent-cloud/monorepo.svg)](https://github.com/openagent-cloud/monorepo/network/members)
[![Issues](https://img.shields.io/github/issues/openagent-cloud/monorepo.svg)](https://github.com/openagent-cloud/monorepo/issues)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/openagent-cloud/monorepo/)

---

Featuring the "ElectricStack"⚡️, a repository for building local-first realtime applications with:

[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white)](https://www.docker.com/) Orchestrating local hot-reload dev stack like a boss

- [![PostgreSQL:5854](https://img.shields.io/badge/PostgreSQL:5854-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)](https://www.prisma.io/) Type-safe database layer [![ElectricSQL:5852](https://img.shields.io/badge/ElectricSQL:5852-yellow?style=flat&logo=database&logoColor=white)](https://electric-sql.com/) Real-time data sync [![Caddy:5853](https://img.shields.io/badge/Caddy:5853-0B3C49?style=flat&logo=caddy&logoColor=white)](https://caddyserver.com/) HTTP/2 reverse proxy makes Electric go brrr

- [![NestJS:5851](https://img.shields.io/badge/NestJS:5851-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)](https://swagger.io/) Blazing fast TypeScript backend

- [![React:5850](https://img.shields.io/badge/React:5850-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) Blazing fast TypeScript frontend

- [![Shared Package](https://img.shields.io/badge/Shared_Package-2F7BEE?style=flat&logo=typescript&logoColor=white)](packages/shared/) Prisma schemas, migrations, and shared types [![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/) [![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black)](https://prettier.io/) Keeping your code clean

---

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

---

> **Important Development Notes:**
>
> - **Docker Compose** is the primary orchestrator that runs the entire stack in development mode with hot reloading enabled. All services (client, server, DB, Electric, Caddy) run simultaneously through Docker Compose.
> - **Do not run** individual services with `npm run dev` as they are already running through Docker Compose.
> - For error checking or testing builds, use `npm run build` instead of starting duplicate processes.
> - **Turborepo** is used for code quality, build, and test tasks across the monorepo (e.g., linting, formatting, building), but not for running the actual services.

---

## **Getting Started:**

- **Install local dependencies in all packages:**
  ```sh
  npm install
  ```
- **Start the entire local Docker compose developer stack:**
  ```sh
  make dev
  ```
- **After running `make dev`, all services will be available:**
  - Client: http://localhost:5850
  - Server API: http://localhost:5851
  - Swagger UI: http://localhost:5851/

---

## **Usage:**

- `make logs` - View Docker compose application logs
- `npm run build` - Build Server, Client and Shared packages (for error checking)
- `make build` - Build entire Docker compose
- `make down` - Stop all services
- `make down-v` - Stop all services and remove volumes

See the Makefile for more automation commands (migrations, Prisma, seeding, env management, etc).

---

## ✨ Notable Features & Examples

- **[@openagent-cloud/message-renderer](./packages/message-renderer/README.md)** (2025-05-18) [![React Library](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/) A powerful React component library for rendering rich text messages with comprehensive markdown support, syntax highlighting, code editing, diagrams, and interactive media elements.

- **[@openagent-cloud/credential-store](./packages/credential-store/README.md)** (2025-05-18) [![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white)](https://www.docker.com/) [![PostgreSQL:5861](https://img.shields.io/badge/PostgreSQL:5861-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)](https://www.prisma.io/) [![NestJS:5860](https://img.shields.io/badge/NestJS:5860-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/) A secure credential store for AI components with usage tracking and proxy capabilities. This service allows secure storage of API keys for AI providers, tracks usage, and proxies requests to these services.
