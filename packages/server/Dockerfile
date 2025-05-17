FROM node:20-slim

# Install OS deps for Prisma and development tools
RUN apt-get update && apt-get install -y openssl procps

# Install global dependencies
RUN npm install -g prisma typescript ts-node @swc/cli @swc/core

WORKDIR /app

# Copy package files
COPY packages/server/package*.json ./

# Clean install dependencies
RUN npm cache clean --force
RUN npm install

# Copy the rest of the source code
COPY packages/server/ ./

# Generate Prisma client with explicit schema path
RUN prisma generate --schema=./prisma/schema.prisma

# Create .swcrc file
COPY packages/server/.swcrc ./

EXPOSE 3000
