# Migration Plan: Web to API

## Inventory of Existing Routes (apps/web/app/api)

| Route | Path | Category | Decision | Status |
|---|---|---|---|---|
| `[...nextauth]` | `apps/web/app/api/auth/[...nextauth]/route.ts` | Auth | **Keep in Web** (NextAuth handles session) | Kept |
| `student` | `apps/web/app/api/avatar/student/route.ts` | Avatar | **Move to API** | TODO |
| `[userId]` | `apps/web/app/api/avatar/[userId]/route.ts` | Avatar | **Move to API** | Proxied |
| `default` | `apps/web/app/api/avatars/default/route.ts` | Avatar | **Move to API** | TODO |
| `[fileId]` | `apps/web/app/api/files/[fileId]/route.ts` | Files | **Move to API** | TODO |
| `health` | `apps/web/app/api/health/route.ts` | System | **Keep/Duplicate** (Both need health checks) | Duplicated |

## New Routes for apps/api (Phase 3)

- `POST /avatar/upload` (Replaces `student` upload logic?) - **Implemented Stub**
- `GET /avatar/:id` (Replaces `[userId]`) - **Implemented**
- `GET /avatars/default` (Replaces `default`) - **TODO**
- `GET /files/:path` (Replaces `[fileId]`) - **Implemented**
- `GET/PUT /settings` (New: Privacy/Settings) - **Implemented**
- `GET/POST /messages` (New: Messages stub) - **Implemented Stub**

## Shared Packages (Phase 2)

- `packages/db`: Prisma Client - **Created**
- `packages/validation`: Zod Schemas - **Created**
- `packages/logger`: Pino Logger - **Created**
- `packages/storage`: GCS Wrapper - **Created**

## Plan

1. Create shared packages. (Done)
2. Move Prisma schema to `packages/db`. (Done)
3. Implement `apps/api` routes. (Partially Done)
4. Update `apps/web` to proxy to `apps/api`. (Started with avatar/[userId])

## TODO List (Remaining Routes)

- [ ] `apps/web/app/api/avatar/student/route.ts` -> Proxy to `POST /avatar/upload`
- [ ] `apps/web/app/api/avatars/default/route.ts` -> Proxy to `GET /avatars/default`
- [ ] `apps/web/app/api/files/[fileId]/route.ts` -> Proxy to `GET /files/:path`
- [ ] Implement `GET /avatars/default` in `apps/api`
- [ ] Implement `POST /avatar/upload` logic in `apps/api`
- [ ] Implement `GET /files/:path` logic (auth check) in `apps/api`
