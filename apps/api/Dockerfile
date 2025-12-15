FROM node:lts-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:lts-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/index.js"]
