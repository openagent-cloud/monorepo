#!/bin/bash

## This entry point script is used to install dependencies and start 
## the server with hot reloading. It is used in the docker-compose.yaml 
## file. *** It is not recommended to run this script manually. *** 
## The script also detects changes to the package.json file and 
## re-installs dependencies and regenerates the Prisma client during
## development.

set -e

# Initial setup
echo "🚀 Installing dependencies..."
npm install 
npx prisma generate

# Start the package.json watcher in background
echo "👀 Starting package.json watcher..."
(
  while true; do
    if inotifywait -e modify -e create -e delete -e move package.json 2>/dev/null; then
      echo "📦 package.json changed! Reinstalling dependencies..."
      npm install
      npx prisma generate
    else
      # If inotifywait fails (might not be installed), fallback to polling
      echo "⚠️  inotifywait not available, using polling..."
      previous_checksum=$(md5sum package.json 2>/dev/null || echo "none")
      sleep 2
      current_checksum=$(md5sum package.json 2>/dev/null || echo "none")
      if [ "$previous_checksum" != "$current_checksum" ]; then
        echo "📦 package.json changed! Reinstalling dependencies..."
        npm install
        npx prisma generate
      fi
    fi
    sleep 1
  done
) &

# Start the NestJS server with hot reload
echo "🔥 Starting NestJS server with hot reload..."
exec npm run start:dev