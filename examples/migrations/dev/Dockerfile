FROM node:20-slim

WORKDIR /app

# Install OpenSSL and other dependencies required by Prisma
RUN apt-get update && apt-get install -y openssl

# Copy package.json files for workspace setup
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/

# Copy prisma directory
COPY packages/shared/prisma ./packages/shared/prisma

# Install dependencies (without using workspace flag)
RUN cd packages/shared && npm install

# Set working directory to the shared package
WORKDIR /app/packages/shared

# Command to run migrations
CMD ["npx", "prisma", "migrate", "deploy"]
