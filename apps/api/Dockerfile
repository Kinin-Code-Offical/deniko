FROM node:lts-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm install --frozen-lockfile

# Generate Prisma Client
RUN pnpm --filter @deniko/db generate

WORKDIR /app/apps/api
RUN pnpm build

FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./

EXPOSE 8080
CMD ["node", "dist/index.js"]
