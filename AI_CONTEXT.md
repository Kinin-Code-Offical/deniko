# 🤖 AI Context & Project Overview

This document provides high-level context for AI assistants (Copilot, ChatGPT, Claude, etc.) working on the Deniko project.

## 🎯 Project Mission

Deniko is a SaaS platform for private tutors and coaching centers. It aims to digitize the management of students, lessons, and payments.

## 🏗️ Architecture Overview (Monorepo)

The project is a **Monorepo** managed by **pnpm workspaces**.

### 📂 Structure

- **`apps/web`**: Next.js 16 (App Router) application.
  - **Role:** Frontend UI, Auth (NextAuth v5), Server Actions (BFF pattern).
  - **Port:** 3000
- **`apps/api`**: Fastify (Node.js) application.
  - **Role:** Core business logic, heavy processing, internal API.
  - **Port:** 4000
- **`packages/db`**: Shared Prisma ORM configuration.
  - **Role:** Database client generator, schema definition.
- **`packages/logger`**: Shared Pino logger configuration.
- **`packages/validation`**: Shared Zod schemas.
- **`packages/storage`**: Shared Google Cloud Storage wrapper.

### 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS v4, Shadcn UI.
- **Backend:** Fastify (API), Next.js Server Actions (Web).
- **Database:** PostgreSQL 18 (managed via Prisma 7).
- **Auth:** Auth.js (NextAuth) v5 with JWT strategy.
- **Infrastructure:** Docker, Google Cloud Run.

## 🧩 Key Patterns

### 1. Internationalization (i18n)

- **Strategy:** Path-based routing (`/[lang]/...`) in `apps/web`.
- **Implementation:** Server-side dictionary fetching.
- **Rule:** Do not hardcode text. Always use `dictionary.section.key`.

### 2. Data Fetching & State

- **Web (Server Components):** Fetch data directly from `apps/api` (via internal fetch) or DB (read-only optimization).
- **Web (Client Components):** Use Server Actions.
- **API:** Fastify routes handle core logic (`apps/api/src/routes`).

### 3. Styling

- **Tailwind CSS v4:** Utility-first.
- **Shadcn UI:** Components in `apps/web/components/ui`.
- **Dark Mode:** `next-themes`.

### 4. Type Safety

- **Strict Mode:** Enabled.
- **No `any`:** Forbidden.
- **Zod:** Mandatory for all input validation (API & Forms).

## 🚀 Recent Changes & Status

- **Database:** Upgraded to PostgreSQL 18.
- **ORM:** Upgraded to Prisma 7.
- **Security:** Rate limiting implemented (Redis/Upstash).
- **PWA:** Splash screens and manifest optimized.
- **Build:** Dockerfiles optimized for pnpm workspaces (patches removed).

## 📝 Rules for AI

1. **Context Awareness:** Check if you are in `apps/web` or `apps/api`.
2. **Imports:** Use workspace packages (`@deniko/db`, `@deniko/logger`) instead of relative paths where possible.
3. **I18n:** Always consider the `lang` parameter in Next.js pages.
4. **Icons:** Use `lucide-react`.
5. **Validation:** Always validate inputs with Zod.
