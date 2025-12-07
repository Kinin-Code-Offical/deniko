# Copilot Instructions for deniko-web

## Proje Özeti

deniko-web; Next.js 16 (App Router) + TypeScript, Prisma + PostgreSQL, Auth.js v5, Tailwind CSS v4, Shadcn UI + Radix, Framer Motion, Docker ve Google Cloud Run üzerine kurulu bir yapıdır. Kod üretirken bu teknolojilere uygun desenleri kullan.

**Bu bölüm için test:**  
Proje yapısı ile uyumsuz bir teknoloji veya pattern önerilmemeli; önerilen her modülün projede mevcut olup olmadığı kontrol edilmeli.

---

## Genel Kurallar

- Tüm kodlar tip güvenli olacak; `any` kullanılmayacak.
- API route’larında giriş doğrulaması için `zod` veya benzeri şema doğrulama kullanılacak.
- Veri erişimi için `lib/prisma.ts` üzerinden Prisma client kullanılacak.
- UI bileşenleri Shadcn UI pattern’ine uygun olacak; Tailwind utility sınıfları kullanılacak.
- Metinler i18n yapısında tanımlanacak; hardcoded string kullanılmayacak.
- Server/Client component ayrımına uy; gereksiz client bileşenleri oluşturma.
- Kod erişilebilirliği (a11y) göz önünde bulundurulacak.
- Performans optimizasyonu: gereksiz re-render ve gereksiz fetch yapma.

**Bu bölüm için test:**

- Oluşturulan kodda `any` veya tip güvenliği ihlalleri olmamalı.
- i18n yapısına aykırı hardcoded string olmamalı.
- Uygun olmayan component türü (server/client) kullanılmamalı.
- Gereksiz DB sorgusu veya performans problemi oluşturmamalı.

---

## Kod Stili

- ESLint ve Prettier kurallarına tam uyum.
- Dosya adları ve klasör yapısı proje içi düzenle uyumlu.
- Commit formatı: `feat/<scope>-description`, `fix/<scope>-description`, `refactor/<scope>-description`.

**Bu bölüm için test:**

- Kod Prettier formatına uygun olmalı.
- ESLint hatası üretmemeli.
- Dosya adlandırma proje standardıyla çatışmamalı.

---

## Güvenlik

- Hiçbir ortam değişkeni, API anahtarı veya kimlik bilgisi commitlenmez.
- Tüm yeni fonksiyonlarda hata yakalama (try/catch) ve anlamlı HTTP dönüşleri sağlanır.
- Auth.js kullanımına uygun session kontrolü yapılır.

**Bu bölüm için test:**

- Önerilen kodda `.env` değeri veya gizli anahtar yer almamalı.
- API route'ları try/catch içermeli.
- Session gerektiren yerlerde kontrol unutulmamalı.

---

## Veri Tabanı

- Model değişiklikleri için Prisma migration dosyası oluşturulur.
- Yeni alanlar eklendiğinde ilgili API route’ları ve tipler güncellenir.
- Transaction gereken yerlerde `prisma.$transaction` kullanılır.

**Bu bölüm için test:**

- Üretilen kod, Prisma tipiyle çelişmemeli.
- Migration gerektiren değişikliklerde migration önerilmeli.
- Transaction gerektiren senaryolarda doğru kullanım sağlanmalı.

---

## Test

- Testler Vitest ile yazılır.
- UI testleri Testing Library ile yazılır.
- API testlerinde mock Prisma client kullanılır.
- Testler `unit` ve `integration` olarak ayrılabilir.

**Bu bölüm için test:**

- Üretilen kod test edilebilir olmalı.
- Bağımlılıklar mocklanabilir şekilde yazılmalı.
- UI bileşenleri Testing Library ile testlenebilir şekilde yapılandırılmalı.

---

## i18n

- Kullanıcıya görünen tüm stringler i18n dictionary dosyalarında tanımlanır.
- Yeni anahtar eklendiğinde hem TR hem EN dosyaları güncellenir.

**Bu bölüm için test:**

- Hiçbir çıktı, kullanıcıya doğrudan görünür raw string içermemeli.
- Yeni anahtar eklendiyse hem TR hem EN dosyasında var olmalı.

---

## PR Gereklilikleri

- Lint, test ve build hatasız geçmeli.
- Yeni özellikler için tipler güncellenmiş olmalı.
- Yeni i18n anahtarları eksiksiz eklenmiş olmalı.
- UI bileşenlerinde erişilebilirlik kuralları uygulanmış olmalı.

**Bu bölüm için test:**

- PR çıktısı lint ve test aşamasından geçebilir olmalı.
- Tip hatası oluşturacak bir alan bırakılmamalı.
- A11y kusurları oluşturulmamalı.

---

## Copilot Prompt Örnekleri

- “Next.js App Router için `/app/api/lesson/route.ts` altında GET ve POST destekleyen bir API route oluştur. Giriş doğrulamasını zod ile yap, Prisma ile DB işlemlerini gerçekleştir, anlamlı hata mesajları döndür.”
- “Shadcn UI tabanlı `LessonCard` adlı bir bileşen oluştur. Props: {id, title, tutorName, date, status}. Tailwind ile tasarla.”
- “Prisma `Lesson` modeline `durationMinutes` alanı ekleyen migration üret ve ilgili API’ları güncelle.”
- “Dashboard sayfasındaki statikleri i18n sistemine taşı.”

**Bu bölüm için test:**

- Örneklerden türetilen kod, yukarıdaki tüm kurallara uygun olmalı.
- Her örnek çıktı test edilebilir, tip güvenli ve mimariye uygun olmalı.
