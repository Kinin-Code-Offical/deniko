# 1. AŞAMA: BUILDER
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Deterministik pnpm
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

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

RUN apk add --no-cache openssl libc6-compat

COPY --from=builder /prod/api/node_modules ./node_modules
COPY --from=builder /prod/api/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 8080
CMD ["node", "dist/index.js"]

# --- MIGRATE IMAGE (Cloud Run Job) ---
FROM node:22-alpine AS migrate
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# Monorepo kök dosyalar
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY packages ./packages

# Bağımlılıklar
RUN pnpm install --frozen-lockfile

# Prisma generate + migrate deploy (ROOT'tan, filter ile)
RUN pnpm --filter @deniko/db generate

# Cloud Run Job default command: migrate deploy
CMD ["pnpm","--filter","@deniko/db","prisma","migrate","deploy"]

