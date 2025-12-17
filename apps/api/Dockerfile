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

# Copy generated Prisma Client to the deployed directory
# It might be in packages/db/node_modules or root node_modules depending on hoisting
RUN if [ -d "/app/packages/db/node_modules/.prisma" ]; then \
      cp -r /app/packages/db/node_modules/.prisma /prod/api/node_modules/.prisma; \
    elif [ -d "/app/node_modules/.prisma" ]; then \
      cp -r /app/node_modules/.prisma /prod/api/node_modules/.prisma; \
    else \
      echo "Warning: Could not find .prisma folder"; \
    fi

FROM node:25-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /prod/api/node_modules ./node_modules
COPY --from=builder /prod/api/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 8080
CMD ["node", "dist/index.js"]
