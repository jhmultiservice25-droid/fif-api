FROM node:24-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma

FROM base AS dependencies

RUN pnpm install --frozen-lockfile
RUN pnpm prisma:generate

FROM dependencies AS development

COPY . .
CMD ["pnpm", "start:dev"]

FROM dependencies AS build

COPY . .
RUN pnpm build
RUN pnpm prune --prod

FROM build AS production

ENV NODE_ENV=production
CMD ["pnpm", "start:prod"]
