# PowerShell ile Bulut Kurulum Adımları

Bu rehber, Deniko platformunun Google Cloud Storage ile çalışacak şekilde Windows üzerinde PowerShell kullanarak hazırlanması için uçtan uca komutları sunar. Örnekler, **Node.js 22+**, **pnpm 9+**, **PostgreSQL 18** ve **Google Cloud hesabı** bulunduğunu varsayar.

> Not: Aşağıdaki değişkenleri kendi ortamınıza göre düzenleyin.
>
> ```powershell
> $ProjectId = "deniko-dev"
> $Region = "europe-west1"
> $BucketName = "deniko-files-$ProjectId"
> $ServiceAccountName = "deniko-storage"
> $EnvRoot = "$PSScriptRoot/.."  # Depo kökü
> ```

## 1) Gerekli araçları kur ve oturum aç
```powershell
# Google Cloud SDK
winget install -e --id Google.CloudSDK -h

# GCloud ile oturum aç
& "$Env:ProgramFiles\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth login
& "$Env:ProgramFiles\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login
```

## 2) Proje ve servis hesabı oluştur
```powershell
# Projeyi ayarla (var olan projeyi kullanıyorsanız create komutunu atlayın)
$gcloud = "$Env:ProgramFiles\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"
& $gcloud projects create $ProjectId
& $gcloud config set project $ProjectId
& $gcloud services enable storage.googleapis.com iam.googleapis.com

# GCS bucket oluştur (Uniform Access açık)
& $gcloud storage buckets create "gs://$BucketName" --location=$Region --uniform-bucket-level-access

# Servis hesabı ve yetki
& $gcloud iam service-accounts create $ServiceAccountName --display-name "Deniko Storage"
& $gcloud projects add-iam-policy-binding $ProjectId `
    --member="serviceAccount:$ServiceAccountName@$ProjectId.iam.gserviceaccount.com" `
    --role="roles/storage.objectAdmin"

# Servis hesabı anahtarı (güvenli bir yerde saklayın)
& $gcloud iam service-accounts keys create "$EnvRoot/gcs-key.json" `
    --iam-account "$ServiceAccountName@$ProjectId.iam.gserviceaccount.com"
$env:GOOGLE_APPLICATION_CREDENTIALS = "$EnvRoot/gcs-key.json"
```

## 3) .env dosyalarını hazırla
```powershell
Copy-Item apps/web/.env.example apps/web/.env -Force
Copy-Item apps/api/.env.example apps/api/.env -Force

# API için bulut bilgilerini doldur
(Get-Content apps/api/.env) `
  -replace '^GCS_BUCKET_NAME=.*', "GCS_BUCKET_NAME=$BucketName" `
  -replace '^GCS_PROJECT_ID=.*', "GCS_PROJECT_ID=$ProjectId" `
  | Set-Content apps/api/.env

# Web için URL ve API kökünü isteğe göre düzenleyin
(Get-Content apps/web/.env) `
  -replace '^INTERNAL_API_BASE_URL=.*', "INTERNAL_API_BASE_URL=http://127.0.0.1:4000" `
  -replace '^NEXTAUTH_URL=.*', "NEXTAUTH_URL=http://localhost:3000" `
  | Set-Content apps/web/.env
```

## 4) Bağımlılıkları yükle ve veritabanını hazırla
```powershell
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
```

## 5) Geliştirme sunucularını başlat
```powershell
pnpm dev
# Web: http://localhost:3000
# API: http://localhost:4000 (dahili)
```

Bu akış sonunda GCS bucket'ı oluşturulur, servis hesabı gerekli yetkilerle hazırlanır, `.env` dosyaları otomatik doldurulur ve uygulama yerelde bulut depolama ile çalışacak şekilde başlatılabilir.
