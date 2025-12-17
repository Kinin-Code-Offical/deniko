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

# Robustly locate and copy the generated Prisma Client
# It is usually in node_modules/.prisma (root) or packages/db/node_modules/.prisma
RUN echo "Locating .prisma folder..." && \
    find /app -type d -name ".prisma" && \
    if [ -d "/app/node_modules/.prisma" ]; then \
      echo "Found in root node_modules"; \
      cp -r /app/node_modules/.prisma /prod/api/node_modules/.prisma; \
    elif [ -d "/app/packages/db/node_modules/.prisma" ]; then \
      echo "Found in packages/db/node_modules"; \
      mkdir -p /prod/api/node_modules; \
      cp -r /app/packages/db/node_modules/.prisma /prod/api/node_modules/.prisma; \
    else \
      echo "WARNING: Could not find .prisma folder. Attempting to generate it..."; \
      cd /app && pnpm --filter @deniko/db generate && \
      cp -r /app/node_modules/.prisma /prod/api/node_modules/.prisma; \
    fi

FROM node:25-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Install runtime dependencies for Prisma (OpenSSL)
RUN apk add --no-cache openssl libc6-compat

COPY --from=builder /prod/api/node_modules ./node_modules
COPY --from=builder /prod/api/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist

EXPOSE 8080
CMD ["node", "dist/index.js"]
