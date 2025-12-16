# @deniko/validation

Bu paket, frontend (`apps/web`) ve backend (`apps/api`) arasında paylaşılan **Zod** şemalarını içerir.

## 🎯 Amaç

Veri doğrulama kurallarını tek bir yerde tutarak, istemci ve sunucu tarafındaki validasyonların tutarlı olmasını sağlamak.

## 📦 İçerik

- Auth şemaları (Login, Register).
- Profil güncelleme şemaları.
- Diğer form validasyonları.

## 🚀 Kullanım

```typescript
import { loginSchema } from '@deniko/validation';

// Frontend'de form validasyonu
const form = useForm({
  resolver: zodResolver(loginSchema),
});

// Backend'de request body validasyonu
const body = loginSchema.parse(request.body);
```
