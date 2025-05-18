# 🤖 @openagent-cloud/discord-bot

A programmable, secure Discord integration service built with NestJS, Prisma, and Discord.js v14+. This service enables role-based user management, feed subscriptions, GitHub webhooks, and microservice health monitoring.

## ✨ Features

- **Multi-Server Support** 🌍: Install on any Discord server with proper permissions
- **Feed Subscriptions** 📢: GitHub updates and service heartbeats posted to designated channels
- **Role Rule Engine** 👑: Dynamic role assignment based on configurable rules
- **Command System** 🔧: Slash commands for bot configuration and management
- **API Integration** 🔌: REST endpoints for programmatic control
- **Multi-tenant Security** 🔒: Guild-scoped data with proper permission checks

## 🌐 Overview

This Discord bot service provides a secure, extensible platform for Discord automation and integration. Using this service, you can:

1. **Automate Workflows**: Post GitHub activity and service health updates to Discord
2. **Manage Roles**: Automatically assign roles based on user attributes
3. **Monitor Services**: Track health of microservices with Discord alerts
4. **Extend Functionality**: Build custom integrations via REST API

## 🚀 Quick Start

### 🛠️ Using Make Commands

```bash
# Install dependencies
make install

# Start the database
make db-up

# Generate Prisma client
make generate

# Run migrations
make migrate

# Seed the database
make seed

# Start the development server
make dev
```

### ⚙️ Manual Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Discord bot token and database credentials

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start the development server
npm run start:dev
```

## 🔌 Core Modules

### 🤖 Bot Module

Initializes Discord.js client and manages core bot functionality.

### 🔧 Command Module

Handles slash commands like `/setup-feed`, `/sync-roles`, and `/status`.

### 📢 Feed Module

Manages feed subscriptions for GitHub repos and service heartbeats.

### 👑 Role Rule Engine

Evaluates user states against rules for dynamic role assignment.

### 💓 Heartbeat Module

Monitors external service health and posts alerts when services go down.

### 🛣️ API Module

Secure endpoints for programmatic control of the bot.

## 📋 Usage Examples

### Setting Up a GitHub Feed

```bash
# Using slash command
/setup-feed type:github repo:username/repo branch:main

# Using API
curl -X POST http://localhost:5860/api/feeds/github \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "guildId": "123456789012345678",
    "channelId": "123456789012345678",
    "repo": "username/repo",
    "branch": "main"
  }'
```

### Syncing Roles

```bash
# Using slash command
/sync-roles

# Using API
curl -X POST http://localhost:5860/api/roles/sync \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "guildId": "123456789012345678"
  }'
```

### Reporting Service Health

```bash
# Using API
curl -X POST http://localhost:5860/api/heartbeat \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "service": "api-gateway",
    "status": "healthy",
    "metadata": {
      "version": "1.0.3",
      "uptime": "3d 12h"
    }
  }'
```

## 🛡️ Security Model

### API Security

- Every API route is protected by an API Key Guard
- Future upgrade path to JWT+2FA

### Command Security

- Permission-based access to slash commands
- Role-based authorization checks

### Feed Security

- Webhook verification for GitHub using X-Hub-Signature-256
- Clean multi-tenant separation by guildId

## 🔧 Environment Variables

| Variable      | Description                     | Example                                     |
| ------------- | ------------------------------- | ------------------------------------------- |
| DATABASE_URL  | PostgreSQL connection string    | postgres://user:pass@localhost:5432/discord |
| DISCORD_TOKEN | Discord bot token               | NzkyNzE1NDU0MTk2MDg4ODQy.X-hvzA.Ovy...      |
| API_KEY       | API key for REST endpoints      | api_0123456789abcdef                        |
| PORT          | Port to run the server on       | 5860                                        |
| GITHUB_SECRET | Secret for webhook verification | gh_webhook_secret123                        |

## ⚡ Future Considerations

- Discord OAuth integration for bot + web login
- Interactive UI components via Discord buttons & dropdowns
- Wallet/ENS/NFT-based role assignment
- Admin web dashboard
- Push-to-deploy feed commands (CI integrations)

## 📄 License

MIT
