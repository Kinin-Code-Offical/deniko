# 1. AŞAMA: BUILDER
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Deterministik pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Monorepo kök dosyalar
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY packages ./packages
COPY apps/api ./apps/api

# Bağımlılıklar
RUN pnpm install --frozen-lockfile

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
