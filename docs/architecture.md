# Mimari Dokümantasyonu

Bu belge, **Deniko** projesinin genel teknik mimarisini, kullanılan teknolojileri ve veri akışını açıklar.

## 🏗️ Teknoloji Yığını (Tech Stack)

- **Monorepo Yönetimi**: pnpm workspaces
- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router)
- **Backend API**: [Fastify](https://fastify.dev/)
- **Dil**: TypeScript
- **Veritabanı**: PostgreSQL
- **ORM**: [Prisma v7](https://www.prisma.io/) (Sadece API servisinde)
- **Kimlik Doğrulama**: Auth.js (NextAuth.js v5) + Argon2
- **Dosya Depolama**: Google Cloud Storage (GCS)
- **Stil**: Tailwind CSS v4
- **UI Kütüphanesi**: Radix UI / shadcn-ui

## 🧩 Sistem Mimarisi

Proje, sorumlulukların ayrıldığı bir monorepo yapısındadır:

### 1. Frontend (`apps/web`)

- **Teknoloji**: Next.js 16
- **Sorumluluk**: Kullanıcı arayüzü, SSR, Auth.js entegrasyonu.
- **Kısıtlamalar**: **Veritabanına doğrudan erişimi yoktur.** Tüm veri işlemleri için Dahili API'yi kullanır.
- **İletişim**: `lib/internal-api.ts` üzerinden `apps/api` ile konuşur.

### 2. Backend API (`apps/api`)

- **Teknoloji**: Fastify
- **Sorumluluk**: İş mantığı, veritabanı erişimi, veri doğrulama.
- **Erişim**: Sadece dahili ağdan (internal network) erişilebilir. Dış dünyaya kapalıdır.
- **Veritabanı**: Prisma Client'ı barındıran tek servistir.

### 3. Paylaşılan Paketler (`packages/*`)

- **`packages/db`**: Prisma şeması ve generated client.
- **`packages/storage`**: Google Cloud Storage işlemleri.
- **`packages/logger`**: Pino tabanlı yapılandırılmış loglama.
- **`packages/validation`**: Zod şemaları (Frontend ve Backend arasında paylaşılır).

## 🔄 Veri Akışı

### İstemci (Browser) -> Frontend (Next.js) -> Backend (Fastify) -> DB

1. **İstemci İsteği**: Kullanıcı tarayıcıdan bir işlem yapar (örn. profil güncelleme).
2. **Next.js Server Action**: İstek `apps/web` tarafında bir Server Action tarafından karşılanır.
3. **Dahili API Çağrısı**: Server Action, `internalApiFetch` kullanarak `http://localhost:4000` (veya prodüksiyon URL'i) adresindeki Fastify servisine istek atar.
4. **İş Mantığı & DB**: Fastify servisi isteği doğrular, Prisma aracılığıyla veritabanı işlemini yapar.
5. **Yanıt**: Sonuç zincirleme olarak geriye döner.

### Dosya Erişimi

1. **Yükleme**: Frontend -> API (Stream) -> GCS.
2. **Okuma**: Frontend -> API (Signed URL veya Stream) -> GCS.

## 🛡️ Güvenlik Önlemleri

- **Veritabanı İzolasyonu**: Frontend'in veritabanı şifrelerine veya bağlantısına erişimi yoktur.
- **Internal API**: API servisi public internete açılmaz, sadece Next.js sunucusu erişebilir.
- **Argon2**: Şifreler Argon2 algoritması ile hashlenir.
- **CI Kontrolleri**: `scripts/check-internal-api-usage.ts` scripti, frontend kodunda yanlışlıkla doğrudan API URL'i (localhost:4000) kullanımını engeller.

## 📂 Klasör Yapısı

```
deniko/
├── apps/
│   ├── web/          # Next.js Frontend
│   └── api/          # Fastify Backend
├── packages/
│   ├── db/           # Prisma & DB Client
│   ├── storage/      # GCS Wrapper
│   ├── logger/       # Logging
│   └── validation/   # Shared Zod Schemas
├── docs/             # Dokümantasyon
└── scripts/          # CI/CD Scriptleri
```
