# Makefile for Local-First Dev Stack (Postgres, ElectricSQL, Prisma, PGlite)

.PHONY: up down logs restart install migrate generate studio seed dev reset pglite-test env gen-env print-env-targets check-env-targets prune prune-all

# Install dependencies
install:
	npm install

# Prisma (using the shared package)
migrate:
	npx turbo run db:migrate --filter=electric-stack-template-shared

generate:
	npx turbo run db:generate --filter=electric-stack-template-shared

studio:
	cd packages/shared && npx prisma studio

# Seed database
seed:
	npx turbo run db:seed --filter=electric-stack-template-shared

# Dev server (full stack with env setup)
dev: dev-d logs

dev-d:
	docker compose --env-file .env -f examples/docker/dev/docker-compose.yaml up -d

dev-build:
	docker compose --env-file .env -f examples/docker/dev/docker-compose.yaml up -d --build

down:
	docker compose --env-file .env -f examples/docker/dev/docker-compose.yaml down

down-v:
	docker compose --env-file .env -f examples/docker/dev/docker-compose.yaml down -v

logs:
	docker compose --env-file .env -f examples/docker/dev/docker-compose.yaml logs -f

restart: down up

full-reset: down-v up-build

# Reset everything
reset: full-reset migrate generate seed