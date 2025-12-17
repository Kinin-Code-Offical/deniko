# 🛠️ Tech Stack & Versions

This document lists the core technologies and libraries used in the Deniko project.

## Monorepo & Build

- **Manager:** `pnpm` (Workspaces)
- **Build System:** Docker (Multi-stage builds)
- **CI/CD:** Google Cloud Build

## Apps

### `apps/web` (Frontend)

- **Framework:** Next.js `^16.0.7` (App Router)
- **UI Library:** React `^19.2.1`
- **Styling:** Tailwind CSS `^4`, Shadcn UI, Framer Motion `^12`
- **Auth:** NextAuth.js `5.0.0-beta.30`
- **Icons:** Lucide React

### `apps/api` (Backend)

- **Framework:** Fastify `^5`
- **Runtime:** Node.js `^22`
- **Validation:** Zod `^3`

## Shared Packages

### Database (`packages/db`)

- **Database:** PostgreSQL `v18`
- **ORM:** Prisma `^7.1.0`
  - `@prisma/client`
  - `@prisma/adapter-pg`

### Utilities

- **Logging:** Pino `^10` (`packages/logger`)
- **Storage:** Google Cloud Storage (`packages/storage`)
- **Validation:** Zod (`packages/validation`)

## Infrastructure

- **Containerization:** Docker
- **Cloud Provider:** Google Cloud Platform (Cloud Run, Cloud SQL, Cloud Storage)
- **Rate Limiting:** Upstash Redis

---
_Last Updated: December 18, 2025_
