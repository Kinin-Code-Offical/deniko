# Lib Internals

## Storage (`storage.ts`)

Wraps the Google Cloud Storage SDK.

- **Singleton Pattern**: `getStorage()` ensures we don't create multiple GCS clients.
- **Security**: `validateKey` enforces path traversal protection and allowed prefixes.

## Database (`db.ts`)

- **Global Cache**: In development, Next.js hot-reloading can exhaust DB connections. We attach the Prisma instance to `globalThis` to reuse it.

## Logger (`logger.ts`)

- **Pino**: Configured to output JSON in production for easy parsing by log aggregators, and pretty-printed logs in development.
