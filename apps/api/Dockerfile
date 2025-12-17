FROM node:25-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile

# Build packages
RUN pnpm --filter "./packages/**" build

# Build API
WORKDIR /app/apps/api
RUN pnpm build

# Deploy
WORKDIR /app
RUN pnpm deploy --filter=@deniko/api --prod --legacy /prod/api

FROM node:25-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /prod/api/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /prod/api/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 8080
CMD ["node", "dist/index.js"]
