$ErrorActionPreference = "Stop"

function Write-LogInfo {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-LogSuccess {
    param([string]$Message)
    Write-Host "[OK]   $Message" -ForegroundColor Green
}

function Write-LogWarning {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-LogError {
    param([string]$Message)
    Write-Host "[ERR]  $Message" -ForegroundColor Red
}

# --- 1. Prerequisite Checks ---

Write-LogInfo -Message "Checking prerequisites..."

if (-not (Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
    Write-LogError -Message "Google Cloud SDK (gcloud) is not installed or not in PATH."
    Write-Host "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
}

$ProxyCmd = "cloud-sql-proxy"
if (-not (Get-Command $ProxyCmd -ErrorAction SilentlyContinue)) {
    $ProxyCmd = "cloud_sql_proxy"
    if (-not (Get-Command $ProxyCmd -ErrorAction SilentlyContinue)) {
        Write-LogError -Message "Cloud SQL Proxy is not installed."
        Write-Host "Please install it:"
        Write-Host "  winget install Google.CloudSDK"
        Write-Host "  or download from: https://cloud.google.com/sql/docs/postgres/sql-proxy"
        exit 1
    }
}
Write-LogSuccess -Message "Found gcloud and $ProxyCmd."

# --- 2. Configuration Loading ---

$EnvFilePath = Join-Path $PSScriptRoot "..\apps\api\.env"
$CloudBuildPath = Join-Path $PSScriptRoot "..\cloudbuild.yaml"
$PORT = 5432

# Load INSTANCE_CONNECTION_NAME
if (Test-Path $EnvFilePath) {
    $EnvContent = Get-Content $EnvFilePath -Raw
    # Match: INSTANCE_CONNECTION_NAME=<value> (optional quotes, whitespace tolerated)
    $Pattern = 'INSTANCE_CONNECTION_NAME\s*=\s*"?([^"\r\n]+)"?'
    if ($EnvContent -match $Pattern) {
        $INSTANCE_CONNECTION_NAME = $matches[1]
        Write-LogSuccess -Message "Loaded Connection Name: $INSTANCE_CONNECTION_NAME"
    } else {
        Write-LogError -Message "INSTANCE_CONNECTION_NAME not found in $EnvFilePath"
        exit 1
    }
} else {
    Write-LogError -Message ".env file not found at $EnvFilePath"
    exit 1
}

# Load SERVICE_ACCOUNT
if (Test-Path $CloudBuildPath) {
    $CloudBuildContent = Get-Content $CloudBuildPath -Raw
    if ($CloudBuildContent -match '_API_SA:\s*"([^"]+)"') {
        $SERVICE_ACCOUNT = $matches[1]
        Write-LogSuccess -Message "Loaded Service Account: $SERVICE_ACCOUNT"
    } else {
        Write-LogError -Message "_API_SA not found in $CloudBuildPath"
        exit 1
    }
} else {
    Write-LogError -Message "cloudbuild.yaml file not found at $CloudBuildPath"
    exit 1
}

# --- 3. Authentication ---

Write-LogInfo -Message "Checking Google Cloud authentication status..."

# Check if we are logged in generally
try {
    $CurrentAccount = gcloud config get-value account 2>$null
    if ([string]::IsNullOrWhiteSpace($CurrentAccount)) {
        Write-LogWarning -Message "You are not logged in to gcloud."
        $ShouldLogin = Read-Host "Do you want to login now? (y/n)"
        if ($ShouldLogin -eq 'y') {
            gcloud auth login
        } else {
            Write-LogError -Message "Authentication required to proceed."
            exit 1
        }
    } else {
        Write-LogInfo -Message "Currently logged in as: $CurrentAccount"
    }
} catch {
    Write-LogWarning -Message "Could not verify gcloud login status."
}

Write-LogInfo -Message "Setting up Application Default Credentials (ADC) with impersonation..."
Write-LogInfo -Message "Target Service Account: $SERVICE_ACCOUNT"

# We always run this to ensure the ADC token is fresh and for the correct impersonated account
try {
    gcloud auth application-default login --impersonate-service-account $SERVICE_ACCOUNT
} catch {
    Write-LogError -Message "Failed to acquire credentials. Please check your permissions."
    exit 1
}

# --- 4. Start Proxy ---

Write-LogSuccess -Message "Starting Cloud SQL Proxy..."
Write-LogInfo -Message "Connection: $INSTANCE_CONNECTION_NAME"
Write-LogInfo -Message "Port: $PORT"

if ($ProxyCmd -eq "cloud-sql-proxy") {
    # v2 syntax
    Start-Process -FilePath $ProxyCmd -ArgumentList @($INSTANCE_CONNECTION_NAME, "--port", "$PORT") -NoNewWindow -Wait
} else {
    # v1 syntax
    Start-Process -FilePath $ProxyCmd -ArgumentList @("-instances=$INSTANCE_CONNECTION_NAME=tcp:$PORT") -NoNewWindow -Wait
}
