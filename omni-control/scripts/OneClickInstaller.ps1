[CmdletBinding()]
param(
    [switch]$SkipDockerBuild,
    [switch]$SkipAgentPackage,
    [string]$Environment = "production"
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Write-Done {
    param([string]$Message)
    Write-Host "✔ $Message" -ForegroundColor Green
}

function Ensure-Admin {
    $currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]$currentIdentity
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        throw "Bitte PowerShell als Administrator starten (Rechtsklick → 'Als Administrator ausführen')."
    }
}

function Ensure-Command {
    param(
        [string]$CommandName,
        [string]$InstallHint
    )

    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        if ($InstallHint) {
            throw "I need '$CommandName'. Hinweis: $InstallHint"
        }
        throw "I need '$CommandName'."
    }
}

function Invoke-ExternalCommand {
    param(
        [string]$FilePath,
        [string[]]$ArgumentList,
        [string]$WorkingDirectory
    )

    $startInfo = @{
        FilePath = $FilePath
        ArgumentList = $ArgumentList
        WorkingDirectory = $WorkingDirectory
        NoNewWindow = $true
        PassThru = $true
        Wait = $true
    }

    $process = Start-Process @startInfo
    if ($process.ExitCode -ne 0) {
        $argsJoined = $ArgumentList -join ' '
        throw "Kommando '$FilePath $argsJoined' fehlgeschlagen (ExitCode $($process.ExitCode))"
    }
}

function New-RandomSecret {
    param([int]$Bytes = 48)
    $buffer = New-Object byte[] $Bytes
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($buffer)
    return [Convert]::ToBase64String($buffer)
}

function Initialize-EnvFile {
    param([string]$RepoRoot, [string]$Environment)

    $envPath = Join-Path $RepoRoot ".env"
    if (Test-Path $envPath) {
        Write-Step ".env vorhanden → Werte bleiben erhalten"
        return
    }

    Write-Step "Erzeuge .env Konfiguration"
    $jwtSecret = New-RandomSecret
    $operatorToken = [Guid]::NewGuid().Guid
    $agentToken = New-RandomSecret 32

    $content = @"
NODE_ENV=$Environment
CONTROLHUB_URL=https://localhost:9443
JWT_SECRET=$jwtSecret
LOG_LEVEL=info
N8N_BASE_URL=http://localhost:5678
BROWSERLESS_URL=ws://localhost:8080
MCPCONTROL_URL=
OPERATOR_TOKEN=$operatorToken
AGENT_TOKEN=$agentToken
AGENT_ID=
N8N_API_KEY=
BROWSERLESS_TOKEN=
MCPCONTROL_TOKEN=
DEMO_AGENT_ID=
"@

    $content | Set-Content -Path $envPath -Encoding UTF8
    Write-Done ".env erzeugt"
}

Ensure-Admin

Ensure-Command -CommandName node -InstallHint "Node.js 20 LTS installieren: https://nodejs.org/"
Ensure-Command -CommandName npm -InstallHint "npm wird mit Node.js installiert"
Ensure-Command -CommandName docker -InstallHint "Docker Desktop installieren: https://www.docker.com/products/docker-desktop/"

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Step "Installiere pnpm@9"
    Invoke-ExternalCommand -FilePath npm -ArgumentList @("install", "-g", "pnpm@9")
    Write-Done "pnpm installiert"
}

Write-Step "Prüfe Docker"
Invoke-ExternalCommand -FilePath docker -ArgumentList @("version")
Write-Done "Docker verfügbar"

$repoRoot = Split-Path -Parent $PSScriptRoot
Initialize-EnvFile -RepoRoot $repoRoot -Environment $Environment

Write-Step "Installiere Abhängigkeiten (pnpm install)"
Invoke-ExternalCommand -FilePath pnpm -ArgumentList @("install") -WorkingDirectory $repoRoot
Write-Done "Abhängigkeiten installiert"

$packagesToBuild = @("@omni/shared", "@omni/gateway", "@omni/automations", "@omni/amt-adapter", "@omni/agent", "@omni/console")
foreach ($pkg in $packagesToBuild) {
    Write-Step "Baue Paket $pkg"
    Invoke-ExternalCommand -FilePath pnpm -ArgumentList @("--filter", $pkg, "build") -WorkingDirectory $repoRoot
    Write-Done "$pkg gebaut"
}

if (-not $SkipAgentPackage) {
    Write-Step "Paket mit Agent-Artefakten erstellen"
    $artifactRoot = Join-Path $repoRoot "artifacts"
    $agentStage = Join-Path $artifactRoot "agent"
    if (-not (Test-Path $artifactRoot)) {
        New-Item -ItemType Directory -Path $artifactRoot | Out-Null
    }
    if (Test-Path $agentStage) {
        Remove-Item $agentStage -Recurse -Force
    }
    New-Item -ItemType Directory -Path $agentStage | Out-Null
    Copy-Item (Join-Path $repoRoot "services\agent\package.json") -Destination $agentStage
    Copy-Item (Join-Path $repoRoot "services\agent\dist") -Destination $agentStage -Recurse
    Copy-Item (Join-Path $repoRoot "services\agent\node_modules") -Destination $agentStage -Recurse
    Copy-Item (Join-Path $repoRoot "scripts\omni-agent-install.ps1") -Destination $artifactRoot

    $zipPath = Join-Path $artifactRoot "OmniControl-AgentBundle.zip"
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
    Compress-Archive -Path (Join-Path $agentStage "*") -DestinationPath $zipPath -Force
    Write-Done "Agent-Bundle unter $zipPath"
}

Write-Step "Starte Control Hub (docker compose up)"
$composeFile = Join-Path $repoRoot "infrastructure\docker-compose.yml"
$composeDir = Split-Path $composeFile -Parent

$composeArgs = @("compose", "-f", $composeFile, "up", "-d")
if (-not $SkipDockerBuild) {
    $composeArgs += "--build"
}
Invoke-ExternalCommand -FilePath docker -ArgumentList $composeArgs -WorkingDirectory $composeDir
Write-Done "Docker-Stack läuft"

Write-Step "Setup vollständig"
Write-Host "Control Hub: https://localhost:9443" -ForegroundColor Yellow
Write-Host "Console:    https://localhost:3001" -ForegroundColor Yellow
if (-not $SkipAgentPackage) {
    Write-Host "Agent Bundle: artifacts\OmniControl-AgentBundle.zip" -ForegroundColor Yellow
}
Write-Host "Nutze scripts\omni-agent-install.ps1 auf Zielrechnern (mit AuthToken aus .env)." -ForegroundColor Yellow
