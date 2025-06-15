FROM node:20-slim

WORKDIR /app

# Install OpenSSL and other dependencies required by Prisma
RUN apt-get update && apt-get install -y openssl

# Copy package.json and prisma files
COPY package*.json ./

# Create lib/prisma directory structure to match local development
RUN mkdir -p ./lib/prisma
COPY lib/prisma ./lib/prisma

# Install dependencies
RUN npm install prisma

# Set environment variable for Prisma
ENV PRISMA_SCHEMA_PATH=/app/prisma/schema.prisma

# Command to run migrations
CMD ["npx", "prisma", "migrate", "deploy"]
