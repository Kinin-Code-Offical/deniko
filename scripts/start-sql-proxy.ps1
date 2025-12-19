$ErrorActionPreference = "Stop"

function Write-LogInfo ($Message) {
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

function Write-LogSuccess ($Message) {
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-LogWarning ($Message) {
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-LogError ($Message) {
    Write-Host "❌ $Message" -ForegroundColor Red
}

# --- 1. Prerequisite Checks ---

Write-LogInfo "Checking prerequisites..."

if (-not (Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
    Write-LogError "Google Cloud SDK (gcloud) is not installed or not in PATH."
    Write-Host "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
}

$ProxyCmd = "cloud-sql-proxy"
if (-not (Get-Command $ProxyCmd -ErrorAction SilentlyContinue)) {
    $ProxyCmd = "cloud_sql_proxy"
    if (-not (Get-Command $ProxyCmd -ErrorAction SilentlyContinue)) {
        Write-LogError "Cloud SQL Proxy is not installed."
        Write-Host "Please install it:"
        Write-Host "  winget install Google.CloudSDK"
        Write-Host "  or download from: https://cloud.google.com/sql/docs/postgres/sql-proxy"
        exit 1
    }
}
Write-LogSuccess "Found gcloud and $ProxyCmd."

# --- 2. Configuration Loading ---

$EnvFilePath = Join-Path $PSScriptRoot "..\apps\api\.env"
$CloudBuildPath = Join-Path $PSScriptRoot "..\cloudbuild.yaml"
$PORT = 5432

# Load INSTANCE_CONNECTION_NAME
if (Test-Path $EnvFilePath) {
    $EnvContent = Get-Content $EnvFilePath -Raw
    if ($EnvContent -match 'INSTANCE_CONNECTION_NAME="?([^"\r\n]+)"?') {
        $INSTANCE_CONNECTION_NAME = $matches[1]
        Write-LogSuccess "Loaded Connection Name: $INSTANCE_CONNECTION_NAME"
    } else {
        Write-LogError "INSTANCE_CONNECTION_NAME not found in $EnvFilePath"
        exit 1
    }
} else {
    Write-LogError ".env file not found at $EnvFilePath"
    exit 1
}

# Load SERVICE_ACCOUNT
if (Test-Path $CloudBuildPath) {
    $CloudBuildContent = Get-Content $CloudBuildPath -Raw
    if ($CloudBuildContent -match '_API_SA:\s*"([^"]+)"') {
        $SERVICE_ACCOUNT = $matches[1]
        Write-LogSuccess "Loaded Service Account: $SERVICE_ACCOUNT"
    } else {
        Write-LogError "_API_SA not found in $CloudBuildPath"
        exit 1
    }
} else {
    Write-LogError "cloudbuild.yaml file not found at $CloudBuildPath"
    exit 1
}

# --- 3. Authentication ---

Write-LogInfo "Checking Google Cloud authentication status..."

# Check if we are logged in generally
try {
    $CurrentAccount = gcloud config get-value account 2>$null
    if ([string]::IsNullOrWhiteSpace($CurrentAccount)) {
        Write-LogWarning "You are not logged in to gcloud."
        $ShouldLogin = Read-Host "Do you want to login now? (y/n)"
        if ($ShouldLogin -eq 'y') {
            gcloud auth login
        } else {
            Write-LogError "Authentication required to proceed."
            exit 1
        }
    } else {
        Write-LogInfo "Currently logged in as: $CurrentAccount"
    }
} catch {
    Write-LogWarning "Could not verify gcloud login status."
}

Write-LogInfo "Setting up Application Default Credentials (ADC) with impersonation..."
Write-LogInfo "Target Service Account: $SERVICE_ACCOUNT"

# We always run this to ensure the ADC token is fresh and for the correct impersonated account
try {
    gcloud auth application-default login --impersonate-service-account $SERVICE_ACCOUNT
} catch {
    Write-LogError "Failed to acquire credentials. Please check your permissions."
    exit 1
}

# --- 4. Start Proxy ---

Write-LogSuccess "Starting Cloud SQL Proxy..."
Write-LogInfo "Connection: $INSTANCE_CONNECTION_NAME"
Write-LogInfo "Port: $PORT"

if ($ProxyCmd -eq "cloud-sql-proxy") {
    # v2 syntax
    Start-Process -FilePath "cloud-sql-proxy" -ArgumentList "$INSTANCE_CONNECTION_NAME --port $PORT" -NoNewWindow -Wait
} else {
    # v1 syntax
    Start-Process -FilePath "cloud_sql_proxy" -ArgumentList "-instances=$INSTANCE_CONNECTION_NAME=tcp:$PORT" -NoNewWindow -Wait
}

