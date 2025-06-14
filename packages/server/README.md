# 🔐 @openagent-cloud/credential-store

A secure credential store for your AI components with usage tracking and proxy capabilities. This service allows you to securely store API keys for various AI providers, track usage, and proxy requests to these services.

## ✨ Features

- **Multi-tenant Support** 🏢: Support multiple tenants with isolated credentials
- **Authentication** 🔐: Secure authentication and authorization with roles
- **Content Types** 📝: Define content types for your web app
- **Content** 📝: Publish and serve content
- **2D Flow Backend** 📝: Serve 2D flow data
- **3D Scene Backend** 📝: Serve 3D scene data (coming soon)
- **Contact/Mailinglist** 📬: Manage website contact form and mailinglist subscriptions
- **Secure Credential Storage** 🔒: Store API keys for OpenAI, Anthropic, Cohere, and more
- **AI Request Proxying** 🔄: Proxy requests to AI services without exposing API keys in your client applications, with support for streaming responses
- **Usage Tracking** 📊: Track all requests to AI services for analytics and billing purposes
- **Swagger Documentation** 📝: Interactive API documentation

## 🌐 Overview

The credential store is part of the Electric Stack Template ecosystem, providing a centralized service for managing AI service credentials. By using this service, you can:

1. **Enhance Security**: Store API keys securely using AES-256-GCM encryption
2. **Simplify Management**: Manage all AI service credentials in one place
3. **Track Usage**: Monitor API usage across all your applications
4. **Proxy Requests**: Route all AI service requests through a single endpoint

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
# Edit .env with your database credentials and encryption key

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed

# Start the development server
npm run start:dev
```

## 🔌 API Usage

### 💾 Storing Credentials

```bash
curl -X POST http://localhost:5860/credentials \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_TENANT_API_KEY" \
  -d '{
    "service": "openai",
    "key": "sk-your-openai-api-key",
    "meta": {"organization": "org-123"}
  }'
```

### 🔄 Proxying Requests

#### Standard Request

```bash
curl -X POST http://localhost:5860/proxy/openai \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_TENANT_API_KEY" \
  -d '{
    "payload": {
      "model": "gpt-4",
      "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
      ]
    }
  }'
```

#### Streaming Request ✨

For real-time token streaming (like the typing effect):

```bash
curl -X POST http://localhost:5860/proxy/openai/stream \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_TENANT_API_KEY" \
  -N \
  -d '{
    "payload": {
      "model": "gpt-4",
      "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Tell me a story"}
      ]
    }
  }'
```

The streaming endpoint returns Server-Sent Events (SSE) that can be consumed in real-time by your frontend application.

## 🐳 Docker Setup

The credential store includes Docker configuration for easy deployment:

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 🛡️ Security

The credential store uses AES-256-GCM encryption to securely store API keys. Each key is encrypted with:

- A random initialization vector (IV)
- Authentication tag for integrity verification
- The master encryption key (set in the CRED_ENCRYPT_KEY environment variable)

### 🔑 Generating a Secure Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🔧 Environment Variables

| Variable         | Description                        | Example                                                          |
| ---------------- | ---------------------------------- | ---------------------------------------------------------------- |
| DATABASE_URL     | PostgreSQL connection string       | postgres://user:pass@localhost:5861/creds                        |
| CRED_ENCRYPT_KEY | 32-byte hex-encoded encryption key | 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef |
| SERVER_PORT      | Port to run the server on          | 5860                                                             |
| ADMIN_API_KEY    | Admin key for tenant management    | admin_0123456789abcdef                                           |

## ⚡ Integration with Electric Stack

This credential store is designed to work seamlessly with the Electric Stack Template, providing a secure way to manage AI credentials across your applications. It can be used as:

1. A standalone service for managing AI credentials
2. An integrated component in the Electric Stack ecosystem
3. A proxy service for all AI requests in your applications

## 📄 License

MIT
