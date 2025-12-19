# 🤖 Deniko AI Context & Architecture Reference

## 🎯 Project Identity

**Deniko** is a SaaS platform designed for private tutors and coaching centers. It is a strictly typed **Monorepo** application managed by **pnpm workspaces**.

## 🏗️ Monorepo Architecture

| Path | Role | Tech Stack | Port | Critical Rules |
|------|------|------------|------|----------------|
| **`apps/web`** | Frontend / BFF | Next.js 16 (App Router), Auth.js v5 | 3000 | **NO DB Access.** i18n Strict. |
| **`apps/api`** | Backend / Core | Fastify, Node.js 22 | 4000 | **Direct DB Access.** Business Logic. |
| **`packages/db`** | Database Layer | Prisma 7, PostgreSQL 18 | - | Imported ONLY by `apps/api`. |
| **`packages/*`** | Shared Libs | Logger, Storage, Validation | - | Stateless utilities. |

## 🧩 Development Patterns

### 1. Internationalization (i18n) - STRICT

- **Routing:** All visible pages MUST reside in `app/[lang]/`.
- **Dictionaries:** Located in `apps/web/dictionaries/{lang}.json`.
- **Usage Rule:**
  - ❌ NEVER hardcode visible text (e.g., `<p>Hello</p>`).
  - ✅ ALWAYS use dictionaries (e.g., `<p>{dict.auth.login}</p>`).
  - Server Components: Fetch via `getDictionary(lang)`.
  - Client Components: Pass dictionary parts as props.

### 2. Data Flow (Strict Separation)

- **Web:** Calls `apps/api` via `fetch` or Server Actions. No direct DB access.
- **API:** Handles Prisma and heavy processing.

### 3. Styling (Tailwind v4)

- Use Tailwind v4 classes directly (no config file).
- Use CSS variables for colors (e.g., `bg-primary`, `text-muted-foreground`).

## 🛠️ Tech Stack

- **Framework:** Next.js 16.0.10
- **Language:** TypeScript 5.9+ (Strict)
- **Styling:** Tailwind CSS v4.1
- **Icons:** Lucide React
