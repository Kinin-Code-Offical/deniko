# @deniko/db

Bu paket, Deniko projesinin veritabanı katmanını oluşturur. **Prisma ORM** şemasını ve oluşturulan (generated) istemciyi içerir.

## 📦 İçerik

- `prisma/schema.prisma`: Veritabanı şeması.
- `src/`: Prisma Client export'ları.

## 🚀 Kullanım

Bu paket `apps/api` ve `apps/web` tarafından kullanılır.

- **apps/api**: Tüm okuma ve yazma işlemleri için kullanır.
- **apps/web**: Sadece **okuma (read-only)** işlemleri için Server Component'lerde performans optimizasyonu amacıyla kullanabilir. Yazma işlemleri API üzerinden yapılmalıdır.

```typescript
import { prisma } from '@deniko/db';

const user = await prisma.user.findFirst();
```

## 🛠️ Komutlar

```bash
# Prisma Client'ı yeniden oluştur
pnpm db:generate

# Veritabanı değişikliklerini uygula (Migration)
# Not: Bu işlem genellikle root dizinden `pnpm prisma:migrate` ile yapılır.
```
