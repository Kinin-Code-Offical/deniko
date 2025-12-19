# PROJE KURALLARI VE AI DAVRANIŞLARI

Bu proje Next.js 16 (App Router), React 19 ve Tailwind CSS v4 kullanan bir Monorepo'dur. Aşağıdaki kurallar **kesindir**.

## 1. Mimari ve İzinler (ÇOK ÖNEMLİ)

- **Web Tarafı Kısıtlamaları (`apps/web`):**
  - ❌ **ASLA** `prisma` veya `@deniko/db` import etme.
  - ❌ **ASLA** veritabanına doğrudan bağlanma.
  - ✅ Veri çekmek için `apps/api`'ye HTTP isteği at veya Server Action kullan.
  - ✅ Paylaşılan tipler için `@deniko/validation` veya `@deniko/logger` kullan.

- **API Tarafı (`apps/api`):**
  - ✅ Veritabanı işlemleri (Prisma) sadece burada yapılır.
  - ✅ Hassas işlemler (Mail, Storage, Cron) burada barınır.

## 2. TypeScript ve Kod Kalitesi

- **Strict Typing:** `any` kullanımı **YASAK**. Bilinmeyen veriler için `unknown` kullan ve Zod ile doğrula.
- **Interface vs Type:** React prop'ları ve obje tanımları için `interface` yerine `type` tercih et.
- **Fonksiyonlar:** Tüm export edilen fonksiyonların dönüş tipi (`ReturnType`) açıkça belirtilmelidir.
- **Async/Await:** `.then()` zincirleri yerine her zaman `async/await` kullan.

## 3. Next.js 16 ve React 19 Kuralları

- **Server Components:** Varsayılan olarak tüm bileşenler Server Component'tir. Sadece `useState`, `useEffect` veya event listener gerekiyorsa dosyanın en başına `'use client'` ekle.
- **Async Components:** Veri çeken bileşenleri `async function` olarak tanımla.
- **Formlar:** React 19 `useActionState` ve `useFormStatus` hook'larını kullan (eski `useFormState` yerine).
- **Görüntü Optimizasyonu:** Her zaman `next/image` kullan. Sabit boyutlar yerine `fill` ve `sizes` prop'larını tercih et.

## 4. Tailwind CSS v4 ve UI

- **Config:** `tailwind.config.js` dosyası arama; v4 CSS-first konfigürasyon kullanır.
- **Responsive:** Mobil öncelikli (mobile-first) yaklaşım zorunludur. `sm:`, `md:`, `lg:` prefixlerini kullan.
- **Renkler:** Hardcoded hex kodları (örn: `#F00`) yerine CSS değişkenlerini (örn: `bg-primary`, `text-destructive`) kullan.

## 5. Dosya ve Klasör Yapısı

- **Page Component:** `page.tsx` dosyaları sadece veri çekme ve layout düzeni içermeli, karmaşık mantığı `components/` altındaki bileşenlere taşı.
- **Dosya İsimleri:** `kebab-case` kullan (örn: `user-profile-card.tsx`).
- **Route Handlers:** API route'ları `app/api/.../route.ts` içinde tanımlanır.

## 6. Güvenlik ve Environment

- **Environment Variables:**
  - `process.env` kullanırken type-safe olduğundan emin ol.
  - Client tarafında sadece `NEXT_PUBLIC_` ile başlayan değişkenleri kullan.
  - Secret'ları (DB şifresi, API Key) asla client componentlere geçirme.
- **SSL/DB:** Google Cloud SQL bağlantıları için sertifikalar base64 decode edilerek kullanılır (bkz: `.cursorrules` legacy).

## 7. Test ve Dokümantasyon

- Yeni bir özellik eklediğinde ilgili `README.md` dosyasını güncelle.
- Kritik mantık değişikliklerinde `pnpm test:cli` komutunu çalıştırarak mimariyi bozmadığından emin ol.
