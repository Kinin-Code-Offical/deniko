param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("api","web","all")]
  [string]$Target
)

$ErrorActionPreference = "Stop"

# Repo root (scripts/ altından çalışacak şekilde)
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $repoRoot

# main branch'e çek
git checkout main | Out-Null
git pull | Out-Null

$PROJECT_ID = "deniko"

# Config dosyaları (senin mevcut yapın)
$configMap = @{
  "api"     = Join-Path $repoRoot "apps\api\cloudbuild.yaml"
  "web"     = Join-Path $repoRoot "apps\web\cloudbuild.yaml"
  "all" = Join-Path $repoRoot "cloudbuild.yaml"  # migrate step root'taysa
}

$configPath = $configMap[$Target]
if (!(Test-Path $configPath)) {
  throw "Cloud Build config bulunamadı: $configPath"
}

# Cloud Build SA (gcloud builds submit --service-account resource name ister)
$cbSaEmail = "deniko-cloudbuild-sa@$PROJECT_ID.iam.gserviceaccount.com"
$cbSa = "projects/$PROJECT_ID/serviceAccounts/$cbSaEmail"

gcloud config set project $PROJECT_ID | Out-Null

# Submit kaynak olarak repo root'u gönderiyoruz (monorepo için doğru)
$buildId = gcloud builds submit $repoRoot `
  --config $configPath `
  --service-account $cbSa `
  --async `
  --format="value(id)"
  
gcloud builds log --stream $buildId

if (-not $buildId) {
  throw "Cloud Build build id dönmedi. Yukarıdaki gcloud çıktısına bak."
}

$marker = Join-Path $repoRoot ".last_build_id.$Target"
$buildId | Set-Content -Encoding UTF8 -Path $marker

Write-Host "Started Cloud Build ($Target): $buildId"
Write-Host "Following from $buildId"
