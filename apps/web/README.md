# Deniko Web Application (@deniko/web)

Bu proje, Deniko platformunun kullanıcı arayüzünü oluşturan **Next.js 16** uygulamasıdır.

## 🏗️ Teknoloji Yığını

- **Framework**: Next.js 16 (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS v4
- **UI Bileşenleri**: Radix UI, Shadcn UI
- **State Yönetimi**: React Server Components, Server Actions
- **Auth**: Auth.js (NextAuth v5)

## ⚠️ Önemli Mimari Kural

**Veri Erişimi:**

- **Yazma İşlemleri (Mutations):** Kesinlikle **Internal API** (`apps/api`) üzerinden yapılmalıdır.
- **Okuma İşlemleri (Queries):** Performans optimizasyonu için Server Component'ler içerisinde **doğrudan veritabanı erişimi (Read-Only)** yapılabilir. Ancak karmaşık iş mantığı gerektiren durumlarda API tercih edilmelidir.
- **API Çağrıları:** `lib/internal-api.ts` dosyasındaki `internalApiFetch` fonksiyonu kullanılmalıdır.

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 22+
- pnpm 10+
- `.env` dosyası (bkz. `.env.example`)
- `apps/api` servisinin çalışıyor olması gerekir (API çağrıları için).

### Komutlar

```bash
# Geliştirme modunda başlat (localhost:3000)
pnpm dev

# Build al
pnpm build

# Prodüksiyon modunda başlat
pnpm start

# Lint kontrolü
pnpm lint
```

## 📂 Klasör Yapısı

```dir
src/ (veya kök dizin)
├── app/
│   ├── [lang]/           # Çoklu dil destekli sayfalar
│   ├── api/              # Next.js API Routes (Auth, Proxy vb.)
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Temel UI bileşenleri (Button, Input vb.)
│   ├── auth/             # Giriş/Kayıt formları
│   ├── dashboard/        # Yönetim paneli bileşenleri
│   └── ...
├── lib/
│   ├── internal-api.ts   # Backend API istemcisi
│   ├── auth.ts           # Auth.js konfigürasyonu
│   └── utils.ts          # Yardımcı fonksiyonlar
├── public/               # Statik dosyalar
└── styles/               # Global CSS
```

## 🌍 Çoklu Dil Desteği (i18n)

Uygulama URL tabanlı i18n kullanır (`/tr/dashboard`, `/en/dashboard`).

- Dil dosyaları: `dictionaries/` (veya ilgili klasörde)
- Middleware: `middleware.ts` dil yönlendirmesini yapar.
