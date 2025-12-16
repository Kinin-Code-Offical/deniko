# Project Roadmap

## Phase 1: Foundation & Security (Current Status)

- [x] **Authentication**: NextAuth v5 setup with Google & Credentials (Argon2).
- [x] **Database**: Prisma v7 upgrade & Schema design.
- [x] **Architecture**: Monorepo split (Web/API) & Internal API implementation.
- [x] **Storage**: GCS integration.
- [ ] **Hardening**: Implement full Rate Limiting on all mutation endpoints.
- [ ] **Testing**: Increase unit test coverage for `lib/` utilities to >80%.

## Phase 2: Core Features (Next)

- [ ] **Dashboard**: Complete Teacher/Student dashboard logic.
- [ ] **Messaging**: Real-time messaging using WebSockets or Polling.
- [ ] **Notifications**: Email notifications via Nodemailer + In-app notification center.
- [ ] **Search**: Implement full-text search for users/courses (Postgres FTS or Algolia).

## Phase 3: Optimization & Scale (Later)

- [ ] **Caching**: Implement Redis caching for heavy DB queries.
- [ ] **CDN**: Put a CDN (Cloudflare) in front of the application.
- [ ] **Analytics**: Custom analytics dashboard for admins.
- [ ] **Mobile App**: React Native wrapper or PWA enhancements.

## Risks & Mitigation

- **Risk**: GCS Bandwidth costs.
  - *Mitigation*: Aggressive caching policies and image optimization.
- **Risk**: Email delivery rates.
  - *Mitigation*: Use a dedicated transactional email provider (SendGrid/AWS SES) instead of generic SMTP.
