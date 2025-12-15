# Security Hardening Guide

Based on OWASP ASVS and Next.js Best Practices.

## 1. Authentication & Session

- [x] **HttpOnly Cookies**: Ensure session cookies are HttpOnly and Secure (in prod).
- [x] **CSRF Protection**: NextAuth handles this automatically.
- [ ] **Session Timeout**: Configure absolute session timeouts (e.g., 30 days).
- [ ] **MFA**: Add Multi-Factor Authentication for Admin roles.

## 2. Data Protection

- [x] **Input Validation**: All Server Actions use `zod` for schema validation.
- [x] **SQL Injection**: Prisma protects against SQLi by default.
- [ ] **Sanitization**: Ensure user-generated HTML (if any) is sanitized with `dompurify`.

## 3. Access Control

- [x] **RBAC**: Role checks on protected routes.
- [x] **IDOR Prevention**: Ensure users can only access their own resources (checked in `lib/storage.ts` and actions).
- [ ] **Audit Logs**: Log sensitive actions (password change, role update) to a persistent audit table.

## 4. Infrastructure

- [x] **Rate Limiting**: `lib/rate-limit-login.ts` implemented. Apply to all public APIs.
- [ ] **Headers**: Configure `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`.
- [ ] **Dependency Scanning**: Run `npm audit` or `pnpm audit` in CI.

## 5. Storage

- [x] **Private Buckets**: GCS buckets are not public.
- [x] **Path Traversal**: `validateKey` in `lib/storage.ts` checks for `..` and illegal characters.
- [x] **File Validation**: Check MIME types and file magic numbers before upload.
