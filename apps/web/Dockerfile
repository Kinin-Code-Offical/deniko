# check=skip=SecretsUsedInArgOrEnv
FROM node:25-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm

# Copy root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy workspace packages
COPY packages ./packages
# Copy app
COPY apps/web ./apps/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder
FROM node:25-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/apps/web ./apps/web
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Build ENV
ENV NEXTAUTH_URL="http://localhost:3000"
ENV AUTH_SECRET="dummy_secret_for_build"
ENV AUTH_GOOGLE_ID="dummy_google_id"
ENV AUTH_GOOGLE_SECRET="dummy_google_secret"
ENV INTERNAL_API_BASE_URL="http://api:4000"

ENV UPSTASH_REDIS_REST_URL="https://dummy.upstash.io"
ENV UPSTASH_REDIS_REST_TOKEN="dummy_token"
ENV DISABLE_DB_FOR_SITEMAP="true"

# Build packages
WORKDIR /app
RUN pnpm --filter "./packages/**" build

# Build
WORKDIR /app/apps/web
RUN pnpm run build

# Runner
FROM node:25-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 8080
CMD ["node", "apps/web/server.js"]