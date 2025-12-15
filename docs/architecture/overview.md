# System Architecture Overview

## High-Level Design

Deniko is a modern educational platform built on the **Next.js App Router** architecture. It leverages server-side rendering (SSR) and React Server Components (RSC) for optimal performance and SEO, while using client components for interactive UI elements.

### Core Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: Auth.js (NextAuth v5)
- **Storage**: Google Cloud Storage (GCS)
- **Styling**: Tailwind CSS + Radix UI
- **Testing**: Vitest

## Architectural Patterns

### 1. Server-First Data Fetching

We prioritize fetching data on the server (RSCs) to reduce client bundle size and improve First Contentful Paint (FCP). Database calls are made directly in server components or via cached data access layers in `lib/db.ts`.

### 2. Layered Architecture

The application follows a loose layered architecture:

- **Presentation Layer**: `app/` (Pages, Layouts) and `components/` (UI).
- **Business Logic Layer**: `lib/` (Utilities, Services) and `actions/` (Server Actions).
- **Data Access Layer**: `prisma/` (Schema) and `lib/db.ts` (Prisma Client).

### 3. Security-Centric Design

- **Authentication**: Handled via `auth.ts` with support for OAuth (Google) and Credentials.
- **Authorization**: Role-based access control (RBAC) using the `Role` enum in Prisma.
- **Privacy**: Explicit privacy enforcement logic (e.g., `profileVisibility`) applied at the data retrieval level.
- **Storage**: Private-by-default GCS buckets with signed URLs for temporary access.

## Key Subsystems

### Authentication & Session

Managed by Auth.js v5. Sessions are JWT-based. The `auth.config.ts` handles edge-compatible configuration, while `auth.ts` manages the Prisma adapter and callbacks.

### File Storage

Files are stored in Google Cloud Storage. Direct public access is disabled.

- **Upload**: Server actions validate and stream files to GCS.
- **Download**: Files are served via signed URLs or a proxy route (`/api/files/[key]`) to enforce access control.

### Internationalization (i18n)

Built-in Next.js i18n routing (`[lang]` dynamic route). Dictionaries are loaded on the server from `dictionaries/{lang}.json`.

### SEO & Metadata

Dynamic metadata generation using Next.js `generateMetadata` API. Sitemaps and `robots.txt` are generated dynamically based on database content (e.g., public profiles).
