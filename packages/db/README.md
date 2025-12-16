# @deniko/db

Bu paket, Deniko projesinin veritabanı katmanını oluşturur. **Prisma ORM** şemasını ve oluşturulan (generated) istemciyi içerir.

## 📦 İçerik

- `prisma/schema.prisma`: Veritabanı şeması.
- `src/`: Prisma Client export'ları.

## 🚀 Kullanım

Bu paket doğrudan `apps/api` tarafından kullanılır. `apps/web` uygulamasının bu pakete erişimi **yoktur** (mimari gereği).

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
