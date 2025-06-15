# ================================
# Development Stage  
# ================================
FROM node:20-slim AS development

# Install OS deps for Prisma and development tools
RUN apt-get update && apt-get install -y openssl procps inotify-tools

# Install global dependencies
RUN npm install -g prisma typescript ts-node @swc/cli @swc/core @nestjs/cli ts-node-dev nodemon

WORKDIR /app

EXPOSE ${NEST_PORT}

# ================================
# Build Stage
# ================================
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for building)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies and install only production deps
RUN npm ci --only=production && npm cache clean --force

# ================================
# Production Stage
# ================================
FROM node:20-slim AS production

# Install only essential runtime dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create app user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copy built application from build stage
COPY --from=build --chown=appuser:appuser /app/dist ./dist
COPY --from=build --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appuser /app/package*.json ./

# Copy Prisma schema and generated client
COPY --from=build --chown=appuser:appuser /app/prisma ./prisma

# Switch to non-root user for security
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${NEST_PORT}/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Set production environment
ENV NODE_ENV=production

EXPOSE ${NEST_PORT}

# Production command
CMD ["node", "dist/src/main.js"]
