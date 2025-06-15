FROM node:20-slim AS builder

# Install system dependencies
RUN apt-get update && \
  apt-get install -y openssl procps && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

# Install system dependencies
RUN apt-get update && \
  apt-get install -y openssl procps && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy the Prisma client files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/lib/prisma/schema.prisma ./lib/prisma/schema.prisma

# Expose the application port
EXPOSE ${NEST_PORT}

# Start the server
CMD ["node", "dist/src/main.js"]
