# 1. AŞAMA: BUILDER
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Deterministik pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Copy lockfile and fetch dependencies (Cached unless lockfile changes)
COPY pnpm-lock.yaml ./
RUN pnpm fetch

# 2. Copy workspace configs and package.json files (Cached unless these specific files change)
COPY pnpm-workspace.yaml package.json .npmrc* ./
COPY packages/db/package.json ./packages/db/
COPY packages/db/prisma/schema.prisma ./packages/db/prisma/
COPY packages/logger/package.json ./packages/logger/
COPY packages/storage/package.json ./packages/storage/
COPY packages/validation/package.json ./packages/validation/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# 3. Install dependencies (Cached unless package.json files change)
RUN pnpm install --offline --frozen-lockfile

# 4. Copy source code (This changes frequently)
COPY packages ./packages
COPY apps/api ./apps/api

# Prisma Client + paket build + API build
RUN pnpm --filter @deniko/db generate
RUN pnpm --filter "./packages/**" build

WORKDIR /app/apps/api
RUN pnpm build

# Prod deploy çıktısını ayrıştır
WORKDIR /app
RUN pnpm deploy --filter=@deniko/api --prod --legacy /prod/api

# Prisma runtime asset’leri (repo yapınıza göre korundu)
RUN mkdir -p /prod/api/node_modules/.prisma && \
    cp -r /app/packages/db/src/generated/client/* /prod/api/node_modules/.prisma/

# 2. AŞAMA: RUNNER
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
ENV PATH="/app/node_modules/.bin:$PATH"

RUN apk add --no-cache openssl libc6-compat

COPY --from=builder /prod/api/node_modules ./node_modules
COPY --from=builder /prod/api/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist

# Copy Prisma schema and config for migrations
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/db/prisma.config.ts ./prisma.config.ts

EXPOSE 8080
CMD ["node", "dist/index.js"]
