FROM node:20-alpine

WORKDIR /app

# Set essential environment variables
ENV ROLLUP_NATIVE=false
ENV NODE_ENV=development

# Copy package.json files for workspace setup
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/

# Copy turbo.json for workspace configuration
COPY turbo.json ./

# Install dependencies specifically for electric packages first
RUN cd packages/client && npm install @electric-sql/pglite @electric-sql/pglite-sync @electric-sql/pglite-react --no-save

# Then install the rest of the dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the client code
COPY packages/client ./packages/client

# Expose the port Vite uses
EXPOSE 5850

# Command is specified in docker-compose.yaml
CMD ["sh", "-c", "cd packages/client && npm run dev -- --host 0.0.0.0"]
