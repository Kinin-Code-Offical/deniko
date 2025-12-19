# check=skip=SecretsUsedInArgOrEnv

FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Copy lockfile and fetch dependencies
COPY pnpm-lock.yaml ./
RUN pnpm fetch

# 2. Copy workspace configs and package.json files
COPY pnpm-workspace.yaml package.json .npmrc* ./
COPY packages/db/package.json ./packages/db/
COPY packages/db/prisma/schema.prisma ./packages/db/prisma/
COPY packages/logger/package.json ./packages/logger/
COPY packages/storage/package.json ./packages/storage/
COPY packages/validation/package.json ./packages/validation/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# 3. Install dependencies
ENV CI=true
RUN pnpm install --offline --frozen-lockfile

# 4. Copy source code
COPY packages ./packages
COPY apps/web ./apps/web

# --------------------------
# Builder
# --------------------------
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/web ./apps/web
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# ---- Build-time vars (client side için gerekli olabilir) ----
ARG NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ARG NEXT_PUBLIC_GA_ID=""
ARG NEXT_PUBLIC_NOINDEX="true"

ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}
ENV NEXT_PUBLIC_NOINDEX=${NEXT_PUBLIC_NOINDEX}

# ---- Build-time dummy vars (secret değil, build kırılmasın diye) ----
ENV NEXTAUTH_URL="http://localhost:3000"
ENV AUTH_SECRET="dummy_secret_for_build"
ENV AUTH_GOOGLE_ID="dummy_google_id"
ENV AUTH_GOOGLE_SECRET="dummy_google_secret"
ENV INTERNAL_API_BASE_URL="http://api:8080"

ENV UPSTASH_REDIS_REST_URL="https://dummy.upstash.io"
ENV UPSTASH_REDIS_REST_TOKEN="dummy_token"
ENV DISABLE_DB_FOR_SITEMAP="true"

# Build shared packages
WORKDIR /app
RUN pnpm --filter "./packages/**" build

# Build web
WORKDIR /app/apps/web
# Ensure we don't try to connect to DB during build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN pnpm run build

# --------------------------
# Runner
# --------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Next standalone
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 8080

# Not: standalone output monorepo path’ini koruduğu için apps/web/server.js doğru hedeflenir.
CMD ["node", "apps/web/server.js"]
