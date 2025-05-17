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

# Install dependencies with minimal flags
RUN npm install --legacy-peer-deps

# Copy the rest of the client code
COPY packages/client ./packages/client

# Expose the port Vite uses
EXPOSE 5850

# Command is specified in docker-compose.yaml
CMD ["npm", "run", "dev", "--workspace=client", "--", "--host", "0.0.0.0"]
