# Deniko Internal API (@deniko/api)

Bu servis, Deniko platformunun backend iş mantığını, veritabanı erişimini ve dosya yönetimini üstlenen **Fastify** tabanlı bir mikroservistir.

## 🛡️ Güvenlik ve Erişim

Bu API servisi **Internal (Dahili)** olarak tasarlanmıştır.

- **Public Erişim Yoktur**: İnternete doğrudan açılmaz. Sadece `apps/web` (Next.js) sunucusu veya diğer dahili servisler erişebilir.
- **Kimlik Doğrulama**:
  - Geliştirme ortamında: Açık erişim (veya basit kontroller).
  - Prodüksiyon ortamında: Google Cloud Run service-to-service authentication (OIDC token) kullanılır.

## 🏗️ Teknoloji Yığını

- **Framework**: Fastify v5
- **Dil**: TypeScript
- **ORM**: Prisma v7 (PostgreSQL)
- **Validasyon**: Zod
- **Loglama**: Pino (@deniko/logger)
- **Depolama**: Google Cloud Storage (@deniko/storage)

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18+
- pnpm
- PostgreSQL
- `.env` dosyası (bkz. `.env.example`)

### Komutlar

```bash
# Geliştirme modunda başlat (Watch mode)
pnpm dev

# Build al
pnpm build

# Prodüksiyon modunda başlat
pnpm start

# Testleri çalıştır
pnpm test
```

## 🔌 API Endpoint Modülleri

Tüm route'lar `src/routes/index.ts` dosyasında kayıt edilir.

| Prefix | Modül | Açıklama |
|--------|-------|----------|
| `/auth` | Auth | Kullanıcı ve hesap yönetimi (NextAuth adapter işlemleri). |
| `/avatar` | Avatar | Kullanıcı profil fotoğraflarını sunma ve yükleme. |
| `/files` | Files | Genel dosya yükleme ve indirme işlemleri. |
| `/settings` | Settings | Kullanıcı ayarları (gizlilik, bildirimler vb.). |
| `/privacy` | Privacy | Gizlilik ayarları yönetimi. |
| `/messages` | Messages | Mesajlaşma sistemi (henüz aktif değil). |
| `/email` | Email | E-posta gönderme servisi (Nodemailer). |
| `/ratelimit` | Rate Limit | İstek sınırlama kontrolleri. |
| `/student` | Student | Öğrenci profili ve işlemleri. |
| `/onboarding` | Onboarding | Yeni kullanıcı karşılama akışı. |
| `/classroom` | Classroom | Sınıf ve ders yönetimi. |
| `/public` | Public | Giriş yapmamış kullanıcılara açık veriler (örn: public profiller). |
| `/dashboard` | Dashboard | Dashboard özet verileri. |

## 📂 Klasör Yapısı

```
src/
├── routes/         # API endpoint tanımları
├── services/       # İş mantığı servisleri (Prisma, Storage vb.)
├── types/          # Tip tanımları
├── app.ts          # Fastify instance oluşturma
├── env.ts          # Ortam değişkenleri validasyonu
└── index.ts        # Entry point
```
