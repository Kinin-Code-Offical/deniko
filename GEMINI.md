---
applyTo: "deniko/**"
---

# Copilot Instructions for deniko (Monorepo Final Rules)

## 0) Output Format

- Varsayılan olarak yalnızca kod üret.
- Mevcut dosyayı düzeltirken sadece ilgili bölümü değiştir.
- Her dosya için tek bir uygun code block ver (ts/tsx/js/json/yml/md).

## 1) Repo Mimarisi (ZORUNLU)

- Monorepo: `apps/web` (Next.js) + `apps/api` (backend) + `packages/*` (shared).
- **DB/Prisma yalnızca `apps/api` veya `packages/db` içinde olabilir.**
- **`apps/web` içinde @prisma/client, prisma.*, packages/db importu YASAK.**
- Storage/Mail/Redis gibi secret gerektiren servisler yalnızca `apps/api` tarafında çalışır.
- `packages/*` içinde **process.env kullanımı YASAK** (config parametre ile gelir).

## 2) TypeScript Kuralları (NO ANY)

- `any` kesinlikle kullanılmayacak (explicit veya implicit).
- `unknown` kullan ve daralt (type guard) ya da generics ile tip ver.
- Her exported function için dönüş tipi belirt.
- API response tipleri `ApiResponse<T>` gibi generics ile yazılacak.
- JSON parse/response için tipli helper kullan (zod validate veya typed decode).

## 3) Next.js (apps/web) Kuralları

- Server/Client ayrımı doğru olacak; gereksiz `use client` yok.
- Server-only modüllerde en üste `import "server-only";`
- Internal API çağrıları tek wrapper üzerinden:
  - `INTERNAL_API_BASE_URL` sadece server-side kullanılır.
- Web build sırasında DB bağlantısı denemesi olmayacak:
  - DB gerektiren her şey `apps/api` endpointine taşınır.
  - Statik prerender DB çağrısı yaratıyorsa ilgili route/layout: `export const dynamic = "force-dynamic";`

## 4) API (apps/api) Kuralları

- Prisma client sadece burada (veya packages/db üzerinden) kullanılacak.
- Env validation (zod) sadece API tarafında DB/Storage/Mail secret’ları zorunlu tutar.
- Hata yönetimi: anlamlı HTTP status + error response.

## 5) Env Düzeni

- `apps/web/.env.example`: sadece Auth.js + NEXT_PUBLIC + INTERNAL_API_BASE_URL
- `apps/api/.env.example`: DB + Storage + Mail + RateLimit
- LHCI/GitHub token gibi şeyler `.env` değil GitHub Secrets’ta.

## 6) Test / CI

- Root komutları:
  - `pnpm lint` => `pnpm -r lint`
  - `pnpm test:all` => `pnpm -r test`
  - `pnpm build` => `pnpm -r build`
- Testler deterministik; DB yoksa skip/guard.

## 7) Güvenlik

- Secret stringleri loglama; logger redaction uygula.
- Client’a secret taşıyan env ya da response üretme.
