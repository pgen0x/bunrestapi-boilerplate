# Use the official Bun image
FROM oven/bun:1.1.5 AS base

WORKDIR /app

COPY package.json bun.lock /
COPY prisma /
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .

# Build for production
FROM base AS production

ENV NODE_ENV=production

# Build for staging
FROM base AS staging

ENV NODE_ENV=staging

# Development stage (with hot-reloading)
FROM base AS development

ENV NODE_ENV=development

CMD ["sh", "-c", "bun run migrate:deploy && bun run generate && bun run start"]