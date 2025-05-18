FROM node:20-slim

# Install OS deps for Prisma and development tools
RUN apt-get update && apt-get install -y openssl procps

# Install global dependencies
RUN npm install -g prisma typescript ts-node @swc/cli @swc/core @nestjs/cli ts-node-dev

WORKDIR /app

EXPOSE ${SERVER_PORT}
