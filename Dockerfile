# --------------------------------------------------------
# 1. AŞAMA: Bağımlılıkları Yükle (Dependencies)
# --------------------------------------------------------
# Alpine 3.20 kullanarak temel güvenliği sağlıyoruz ama update komutunu siliyoruz.
FROM node:20-alpine3.20 AS deps
# Sadece Prisma için gerekli kütüphaneyi kuruyoruz (Çok hızlıdır)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Paket dosyalarını kopyala
COPY package.json package-lock.json* ./
# Bağımlılıkları kur
RUN npm ci --legacy-peer-deps

# --------------------------------------------------------
# 2. AŞAMA: Projeyi Derle (Builder)
# --------------------------------------------------------
FROM node:20-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build sırasında Prisma generate için geçici dummy URL
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Prisma istemcisini oluştur
RUN npx prisma generate

# Next.js projesini build et
RUN npm run build

# --------------------------------------------------------
# 3. AŞAMA: Çalıştır (Runner - Production)
# --------------------------------------------------------
FROM node:20-alpine3.20 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Güvenlik için root olmayan kullanıcı
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Dosyaları kopyala
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]