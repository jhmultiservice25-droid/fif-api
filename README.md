# FIF 2026 API

Backend for the **FIKIRI Innovation Festival (FIF) 2026** recruitment platform. It exposes the public committee and volunteer application flows, the committee job catalog, and a cookie-authenticated staff API for reviewing applications, changing statuses, viewing statistics, exporting CSV files, and reading notifications.

## Technology

- Node.js 24
- NestJS 11 and Express
- TypeScript 5.9
- Prisma 6 and PostgreSQL
- Better Auth 1.7
- Swagger/OpenAPI and Scalar
- pnpm

## Requirements

- Node.js 24 (the version used by the Docker image)
- pnpm via Corepack
- PostgreSQL, locally or through Docker
- Docker with Compose, if using the container workflow

## Configuration

Copy the checked-in example, then replace its development credentials:

```bash
cp .env.example .env
```

For the production Compose file, set `UPLOAD_DIR=/app/uploads` so uploads are written to its persistent `uploads_data` volume.

## Run locally

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Make sure the PostgreSQL server referenced by `DATABASE_URL` is running, then prepare the database:

```bash
pnpm prisma:migrate:deploy
pnpm prisma:seed
```

## Run with Docker Compose

Start the database and Redis, apply migrations, and seed the catalog:

```bash
docker compose -f compose.dev.yml up
docker compose -f compose.dev.yml exec api pnpm prisma:migrate:deploy
docker compose -f compose.dev.yml exec api pnpm prisma:seed
```

Postgres and Redis use named volumes (`postgres_data`, `redis_data`). `docker compose stop` and `docker compose down` keep that data. Only `docker compose down -v` wipes it.

Local `pnpm start:dev` uses `DATABASE_URL` on `localhost:${DB_PORT}` (5434 by default) so it does not collide with other Postgres instances on 5432. Inside Compose, the API talks to the `db` service.

## Architecture notes

- [Documentation index](docs/README.md)
- [ADR-0001: platform architecture, hiring domain, and session auth](docs/adr/0001-platform-architecture.md)
- [ADR-0002: notifications, email, and file storage](docs/adr/0002-notifications-email-files.md)
- [Infrastructure request](docs/undp-infra-request.md)
