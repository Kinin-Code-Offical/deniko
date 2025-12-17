# Deniko'ya Katkıda Bulunma

## Geliştirme Süreci

1. **Klonla & Yükle**

    ```bash
    git clone <repo>
    pnpm install
    ```

2. **Ortam Kurulumu**
    - `.env.example` dosyalarını `.env` olarak kopyalayın (`apps/web`, `apps/api` ve kök dizin için gerekliyse).
    - Gerekli anahtarları doldurun (DATABASE_URL, AUTH_SECRET, GCS_*).

3. **Veritabanı**

    ```bash
    pnpm prisma:generate
    pnpm prisma:migrate
    ```

4. **Geliştirme Sunucusunu Başlat**
    Tüm projeyi (Web + API) başlatmak için:

    ```bash
    pnpm dev
    ```

    Sadece Web:

    ```bash
    pnpm --filter @deniko/web dev
    ```

    Sadece API:

    ```bash
    pnpm --filter @deniko/api dev
    ```

## Kod Stili

- **Linting**: ESLint zorunludur. `pnpm lint` komutunu çalıştırın.
- **Formatlama**: Prettier zorunludur. `pnpm format` komutunu çalıştırın.
- **Commitler**: Conventional Commits formatını kullanın (feat, fix, docs, chore).

## Dokümantasyon

- Yeni dosyalar eklerseniz ilgili klasördeki `README.md` dosyasını güncelleyin.
- Dışa aktarılan (exported) fonksiyonlara TSDoc yorumları `/** ... */` ekleyin.
