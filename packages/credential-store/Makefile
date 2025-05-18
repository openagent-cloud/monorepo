# Makefile for @openagent-cloud/credential-store

.PHONY: install generate migrate seed dev start build test test-watch test-e2e analytics-migrate analytics-seed analytics-report db-up db-down logs restart reset env gen-key gen-creds down down-v prune

# Install dependencies
install:
	npm install

# Prisma commands
generate:
	npx prisma generate

migrate:
	npx prisma migrate dev

studio:
	npx prisma studio

seed:
	npx prisma seed

reset-db:
	npx prisma migrate reset

start:
	npm run start

build:
	npm run build

# Test commands
test:
	npm run test

test-watch:
	npm run test:watch

test-e2e:
	npm run test:e2e

# Analytics commands
analytics-migrate:
	npx prisma migrate dev

analytics-seed:
	npx prisma db seed

analytics-report:
	curl -X GET "http://localhost:3000/analytics/tokens?days=30" -H "x-api-key: YOUR_API_KEY" | jq

# Database commands
db-up:
	docker compose --env-file ./.env up -d postgres

db-down:
	docker compose --env-file ./.env down postgres

# Docker commands
dev:
	docker compose --env-file ./.env up -d

dev-build:
	docker compose --env-file ./.env up -d --build

dev-logs: dev logs

down:
	docker compose --env-file ./.env down

down-v:
	docker compose --env-file ./.env down -v

logs:
	docker compose --env-file ./.env logs -f

prune:
	docker system prune -f

# Reset everything
reset:
	make db-down
	docker volume prune -f
	make db-up
	make migrate
	make seed

# Setup for token tracking
setup-tokens:
	make db-up
	make migrate-tokens
	make seed
	@echo "Setup for token tracking complete!"

# Generate a secure encryption key
gen-key:
	@node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate secure credentials with options
gen-creds:
	@echo "Generating secure credentials..."
	@echo "\n=== API KEY (36 chars) ===\n"
	@node -e "console.log('ak_' + require('crypto').randomBytes(16).toString('hex'))"
	@echo "\n=== JWT SECRET (64 chars) ===\n"
	@node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
	@echo "\n=== ENCRYPTION KEY (64 hex chars) ===\n"
	@node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
	@echo "\n=== STRONG PASSWORD (24 chars) ===\n"
	@node -e "const c='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?'; console.log(Array(24).fill().map(()=>c.charAt(Math.floor(Math.random()*c.length))).join(''))"
	@echo "\nCredentials generated successfully!"

# Setup environment
env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Created .env file from .env.example"; \
		echo "You should update the CRED_ENCRYPT_KEY with a secure key:"; \
		make gen-key; \
	else \
		echo ".env file already exists"; \
	fi

# Help command
help:
	@echo "Available commands:"
	@echo "  make install       - Install dependencies"
	@echo "  make generate      - Generate Prisma client"
	@echo "  make migrate       - Run database migrations"
	@echo "  make seed          - Seed the database"
	@echo "  make dev           - Start development server"
	@echo "  make start         - Start production server"
	@echo "  make build         - Build the application"
	@echo "  make test          - Run tests"
	@echo "  make test-e2e      - Run end-to-end tests"
	@echo "  make db-up         - Start the database"
	@echo "  make db-down       - Stop the database"
	@echo "  make logs          - View logs"
	@echo "  make docker-up     - Start all Docker containers"
	@echo "  make docker-down   - Stop all Docker containers"
	@echo "  make docker-logs   - View Docker logs"
	@echo "  make docker-prune  - Prune Docker resources"
	@echo "  make reset         - Reset everything"
	@echo "  make gen-key       - Generate a secure encryption key"
	@echo "  make gen-creds     - Generate various secure credentials (API keys, JWT secrets, etc.)"
	@echo "  make env           - Setup environment variables"
	@echo "  make help          - Show this help message"

# Default target
.DEFAULT_GOAL := help
