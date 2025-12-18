# =========================
# Deniko - Artifact Registry bootstrap + build/push (API + WEB)
# =========================
$ErrorActionPreference = "Stop"

$PROJECT_ID = "deniko"
$REGION     = "europe-west1"
$AR_REPO    = "deniko"

$API_IMAGE  = "deniko-api"
$WEB_IMAGE  = "deniko-web"

# Auth + project
gcloud auth login | Out-Null
gcloud config set project $PROJECT_ID | Out-Null

# APIs
gcloud services enable artifactregistry.googleapis.com cloudbuild.googleapis.com | Out-Null

# Ensure AR repo exists (idempotent)
try {
  gcloud artifacts repositories describe $AR_REPO --location $REGION | Out-Null
} catch {
  gcloud artifacts repositories create $AR_REPO `
    --repository-format=docker `
    --location=$REGION `
    --description="Deniko images" | Out-Null
}

# Local docker auth (opsiyonel)
gcloud auth configure-docker "$REGION-docker.pkg.dev" | Out-Null

# Build-only config (PowerShell değişkenlerini expand ETME)
$tmp = Join-Path $PWD "cloudbuild.build-only.yaml"

@'
substitutions:
  _REGION: "europe-west1"
  _AR_REPO: "deniko"
  _API_IMAGE: "deniko-api"
  _WEB_IMAGE: "deniko-web"

steps:
  # API build + push
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "build"
      - "-f"
      - "apps/api/Dockerfile"
      - "-t"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_AR_REPO}/${_API_IMAGE}:$BUILD_ID"
      - "."
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "push"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_AR_REPO}/${_API_IMAGE}:$BUILD_ID"

  # WEB build + push
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "build"
      - "-f"
      - "apps/web/Dockerfile"
      - "-t"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_AR_REPO}/${_WEB_IMAGE}:$BUILD_ID"
      - "."
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "push"
      - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_AR_REPO}/${_WEB_IMAGE}:$BUILD_ID"

images:
  - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_AR_REPO}/${_API_IMAGE}:$BUILD_ID"
  - "${_REGION}-docker.pkg.dev/$PROJECT_ID/${_AR_REPO}/${_WEB_IMAGE}:$BUILD_ID"
'@ | Set-Content -Path $tmp -Encoding UTF8

# Submit
gcloud builds submit . --config $tmp

Write-Host ""
Write-Host "Build OK. Images:"
Write-Host "  $REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/${API_IMAGE}:<BUILD_ID>"
Write-Host "  $REGION-docker.pkg.dev/$PROJECT_ID/$AR_REPO/${WEB_IMAGE}:<BUILD_ID>"
Write-Host ""
