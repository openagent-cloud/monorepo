# ⚡️ [openagent.cloud](https://openagent.cloud) monorepo

## 🤔 ELI5: Full Stack Developer Tool Bench

> # 💡 **Vision**
>
> To create a reactive, real-time data platform that synchronizes state instantly and reliably across distributed systems—empowering developers, artists, and creators to build powerful tools, orchestrate complex workflows, and express dynamic ideas through living data.
>
> # 💃🏻 **Mission**
>
> To build a modular, event-driven platform that connects applications, services, and interfaces through shared real-time state. By combining fast in-memory state management (Zustand), peer-to-peer and centralized orchestration, and rich visual tooling, to enable both utility and creativity—from dashboards and agent systems to multiplayer games and generative art. The mission is to make data movement visible, programmable, and expressive.
>
> ### ⚡️ **From founder**
>
> This is a collection of my personal experiments released here for the sake of saving time, and for the greater good 🚀

<!-- For Discord embedding, use this link when sharing to Discord: -->
<!-- https://raw.githack.com/openagent-cloud/monorepo/main/packages/client/public/discord-preview.html -->

<!-- Enhanced Discord embeds available at: -->
<!-- https://raw.githack.com/openagent-cloud/monorepo/main/packages/client/public/enhanced-discord-preview.html -->

<!-- Dynamic SVG social card (updates with current date): -->
<!-- https://raw.githack.com/openagent-cloud/monorepo/main/packages/client/public/dynamic-social-card.svg -->

<!-- A complete showcase of dynamic Discord elements can be found in: SHOWCASE_README.md -->

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/openagent-cloud/monorepo/issues)
[![Stars](https://img.shields.io/github/stars/openagent-cloud/monorepo.svg)](https://github.com/openagent-cloud/monorepo/stargazers)
[![Forks](https://img.shields.io/github/forks/openagent-cloud/monorepo.svg)](https://github.com/openagent-cloud/monorepo/network/members)
[![Issues](https://img.shields.io/github/issues/openagent-cloud/monorepo.svg)](https://github.com/openagent-cloud/monorepo/issues)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/openagent-cloud/monorepo/)

---

Featuring the "ElectricStack"⚡️, a repository for building local-first realtime applications with:

[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white)](https://www.docker.com/) Orchestrating local hot-reload dev stack like a boss

- [![PostgreSQL-:5853](https://img.shields.io/badge/PostgreSQL-:5853-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)](https://www.prisma.io/) Type-safe database layer [![ElectricSQL-:5852](https://img.shields.io/badge/ElectricSQL-:5852-yellow?style=flat&logo=database&logoColor=white)](https://electric-sql.com/) Real-time data sync [![Caddy-:5854](https://img.shields.io/badge/Caddy-:5854-0B3C49?style=flat&logo=caddy&logoColor=white)](https://caddyserver.com/) HTTP/2 reverse proxy makes Electric go brrr

- [![NestJS-:5851](https://img.shields.io/badge/NestJS-:5851-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)](https://swagger.io/) Blazing fast TypeScript backend

- [![React-:5850](https://img.shields.io/badge/React-:5850-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) Blazing fast TypeScript frontend

- [![Shared Package](https://img.shields.io/badge/Shared_Package-2F7BEE?style=flat&logo=typescript&logoColor=white)](packages/shared/) Prisma schemas, migrations, and shared types [![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/) [![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black)](https://prettier.io/) Clean Code

---

## Project Structure

| Package/Service              | Description                                                 | URL                                                          | Documentation                                            |
| ---------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `packages/client/`           | React frontend application                                  | http://localhost:5850                                        | [View README](packages/client/README.md)                 |
| `packages/server/`           | NestJS backend API with Swagger documentation               | http://localhost:5851<br>http://localhost:5851/api (Swagger) | [View README](packages/server/README.md)                 |
| `packages/shared/`           | Shared package with Prisma schema, migrations, common types | -                                                            | [View README](packages/shared/README.md)                 |
| `packages/message-renderer/` | React component for rich markdown rendering                 | -                                                            | [View README](packages/message-renderer/README.md)       |
| `packages/discord-bot/`      | Discord bot with logging system                             | -                                                            | [View README](packages/discord-bot/src/logger/README.md) |
| PostgreSQL                   | Database server                                             | localhost:5853                                               | -                                                        |
| ElectricSQL                  | Real-time data sync service                                 | localhost:5852                                               | -                                                        |
| Caddy                        | HTTP/2 reverse proxy                                        | localhost:5854                                               | -                                                        |

> **Important Development Notes:**
>
> - **Docker Compose** is the primary orchestrator that runs the entire stack in development mode with hot reloading enabled. All services (client, server, DB, Electric, Caddy) run simultaneously through Docker Compose.
> - **Do not run** individual services with `npm run dev` as they are already running through Docker Compose.
> - For error checking or testing builds, use `npm run build` instead of starting duplicate processes.
> - **Turborepo** is used for code quality, build, and test tasks across the monorepo (e.g., linting, formatting, building), but not for running the actual services.

---

## **Getting Started:**

### **Option 1: Interactive Setup Wizard (Recommended)**

Run our fancy interactive setup wizard that will guide you through the entire setup process:

```sh
make setup
```

The wizard will:

1. Generate secure environment variables for all packages
2. Install all dependencies
3. Start the Docker compose stack with all services
4. Run database migrations and generate Prisma client
5. Seed the database with sample data
6. Display URLs for accessing the application

### **Option 2: Quick Start**

If you prefer a non-interactive quick start:

```sh
make dev-build-all
```

This will run all the setup steps automatically with default options.

### **Option 3: Manual Setup**

If you prefer to run each step separately:

- **Install local dependencies in all packages:**
  ```sh
  npm install
  ```
- **Start the entire local Docker compose developer stack:**
  ```sh
  make dev
  ```
- **Seed the database:**
  ```sh
  cd packages/shared
  npm run db:seed
  ```

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

- **[@openagent-cloud/message-renderer](./packages/message-renderer/README.md)** (2025-05-18) [![React Library](https://img.shields.io/badge/React-Library-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/) A powerful React component library for rendering rich text messages with comprehensive markdown support, syntax highlighting, code editing, diagrams, and interactive media elements.

- **[@openagent-cloud/credential-store](./packages/credential-store/README.md)** (2025-05-18) [![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat&logo=docker&logoColor=white)](https://www.docker.com/) [![PostgreSQL-:5861](https://img.shields.io/badge/PostgreSQL-:5861-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white)](https://www.prisma.io/) [![NestJS-:5860](https://img.shields.io/badge/NestJS-:5860-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/) A secure credential store for AI components with usage tracking and proxy capabilities. This service allows secure storage of API keys for AI providers, tracks usage, and proxies requests to these services.
