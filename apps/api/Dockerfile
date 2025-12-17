# 1. AŞAMA: BUILDER
FROM node:22-alpine AS builder
# Node 25 yerine LTS veya stabil 22-alpine önerilir (GCP uyumluluğu için)
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
RUN npm install -g pnpm@10

# Monorepo yapısı için kök dosyalar
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./
COPY packages ./packages
COPY apps/api ./apps/api

# Bağımlılıkları yükle
RUN pnpm install --frozen-lockfile

# 1. Önce Prisma Client oluştur (Custom output sayesinde packages/db/src içine gider)
RUN pnpm --filter @deniko/db generate

# 2. Paketleri build et (Type stripping hatasını önlemek için JS çıktılarını üretir)
RUN pnpm --filter "./packages/**" build

# 3. API'yi build et
WORKDIR /app/apps/api
RUN pnpm build

# 4. Üretim dosyalarını ayrıştır (Deploy)
WORKDIR /app
RUN pnpm deploy --filter=@deniko/api --prod --legacy /prod/api

# Üretilen Prisma Client'ı deploy klasörüne kopyala (Runtime'da erişim için)
RUN mkdir -p /prod/api/node_modules/.prisma && \
    cp -r /app/packages/db/src/generated/client/* /prod/api/node_modules/.prisma/

# 2. AŞAMA: RUNNER
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

RUN apk add --no-cache openssl libc6-compat

# Sadece gerekli olan üretim bağımlılıklarını ve derlenmiş kodu al
COPY --from=builder /prod/api/node_modules ./node_modules
COPY --from=builder /prod/api/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist

# Port ve Çalıştırma
EXPOSE 8080
CMD ["node", "dist/index.js"]