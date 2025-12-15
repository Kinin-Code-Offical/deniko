# Module Guide

This document details the core modules of the Deniko system.

## 1. Authentication Module (`auth.ts`, `auth.config.ts`)

- **Purpose**: Manages user identity, sessions, and provider integrations.
- **Key Components**:
  - `NextAuth` initialization.
  - `PrismaAdapter`: Persists users and sessions to Postgres.
  - `CredentialsProvider`: Email/Password login with bcrypt hashing.
  - `GoogleProvider`: OAuth login.
  - `callbacks`: Handles session enrichment (adding `role`, `id` to session).

## 2. Database Module (`lib/db.ts`, `prisma/`)

- **Purpose**: Centralized database access.
- **Key Components**:
  - `PrismaClient` singleton to prevent connection exhaustion in dev.
  - `schema.prisma`: Defines data models (User, Session, File, etc.).
  - **Internals**: Uses connection pooling (if configured) and handles query logging in development.

## 3. Storage Module (`lib/storage.ts`)

- **Purpose**: Abstraction layer for Google Cloud Storage.
- **Key Functions**:
  - `uploadObject`: Streams data to GCS bucket.
  - `getSignedUrlForKey`: Generates time-limited V4 signed URLs.
  - `getObjectStream`: Returns a readable stream for a file (used in proxy).
  - `deleteObject`: Removes files.
- **Security**: Validates keys against `ALLOWED_PREFIXES` to prevent path traversal.

## 4. Logging Module (`lib/logger.ts`)

- **Purpose**: Structured logging for observability.
- **Implementation**: Uses `pino` for JSON-formatted logs.
- **Usage**: `logger.info({ event: 'user_login', userId }, 'User logged in')`.

## 5. Rate Limiting (`lib/rate-limit-login.ts`)

- **Purpose**: Protects sensitive endpoints (login, signup) from abuse.
- **Implementation**: Uses `@upstash/ratelimit` (backed by Redis/Upstash) or an in-memory fallback if Redis is not configured.
- **Logic**: Limits requests based on IP and/or Identifier (email).

## 6. SEO Module (`lib/seo.ts`, `lib/json-ld.ts`)

- **Purpose**: Generates meta tags and structured data.
- **Key Components**:
  - `constructMetadata`: Helper to merge default SEO tags with page-specific ones.
  - `JsonLd`: Components to render Schema.org JSON-LD scripts.
