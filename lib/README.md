# Lib Directory Documentation

## Purpose

The `lib/` directory contains pure utility functions, business logic, and shared services. It is the "brain" of the application, separated from the UI.

## Key Modules

| File | Purpose | Key Exports | Dependencies |
|------|---------|-------------|--------------|
| `db.ts` | Prisma Client Singleton | `db` | `@prisma/client` |
| `auth.ts` | Auth Configuration | `auth`, `signIn`, `signOut` | `next-auth` |
| `storage.ts` | GCS File Operations | `uploadObject`, `getSignedUrlForKey` | `@google-cloud/storage` |
| `logger.ts` | Structured Logging | `logger` | `pino` |
| `utils.ts` | UI Helpers (clsx) | `cn` | `clsx`, `tailwind-merge` |

## Usage Guidelines

- **Stateless**: Functions here should generally be stateless.
- **Environment**: Most files here run on the **Server**. If a file is safe for client use, ensure it doesn't import server-only secrets.
