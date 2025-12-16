# @deniko/storage

Bu paket, **Google Cloud Storage (GCS)** işlemlerini yöneten yardımcı kütüphanedir.

## 📦 Özellikler

- Dosya yükleme (Stream veya Buffer).
- Dosya okuma (Stream).
- Signed URL oluşturma.
- Varsayılan avatar yönetimi.

## 🚀 Kullanım

```typescript
import { createStorage } from '@deniko/storage';

const storage = createStorage({
  bucketName: process.env.GCS_BUCKET_NAME,
  options: {
    projectId: process.env.GCS_PROJECT_ID,
    credentials: {
      client_email: process.env.GCS_CLIENT_EMAIL,
      private_key: process.env.GCS_PRIVATE_KEY,
    },
  },
});

// Dosya akışı al
const stream = await storage.getObjectStream('avatars/user-123.jpg');
```
