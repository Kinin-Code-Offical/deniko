# @deniko/logger

Bu paket, **Pino** tabanlı yapılandırılmış (structured) loglama altyapısını sağlar.

## 📦 Özellikler

- JSON formatında loglama (Prodüksiyon için).
- Pretty print (Geliştirme ortamı için).
- Hassas verilerin (şifre, token vb.) maskelenmesi (Redaction).

## 🚀 Kullanım

```typescript
import { createLogger } from '@deniko/logger';

const logger = createLogger({
  level: 'info',
  isProduction: process.env.NODE_ENV === 'production',
});

logger.info({ userId: '123' }, 'Kullanıcı giriş yaptı');
logger.error(err, 'Bir hata oluştu');
```
