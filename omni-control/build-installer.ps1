# Omni Control Suite - Installer Builder
# Erstellt eine fertig installierbare .exe-Datei

param(
    [switch]$Clean,
    [switch]$Build,
    [switch]$Package
)

$ErrorActionPreference = "Stop"

# Pfad-Konfiguration
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$InstallerScript = Join-Path $PSScriptRoot "installer.iss"
$OutputDir = Join-Path $PSScriptRoot "installer"
$InnoSetupPath = "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Test-Prerequisites {
    Write-Step "Überprüfe Voraussetzungen..."

    # Node.js prüfen
    try {
        $nodeVersion = & node --version
        Write-Success "Node.js gefunden: $nodeVersion"
    } catch {
        Write-Error "Node.js ist nicht installiert oder nicht im PATH"
        exit 1
    }

    # pnpm prüfen
    try {
        $pnpmVersion = & pnpm --version
        Write-Success "pnpm gefunden: v$pnpmVersion"
    } catch {
        Write-Error "pnpm ist nicht installiert oder nicht im PATH"
        exit 1
    }

    # Inno Setup prüfen
    if (Test-Path $InnoSetupPath) {
        Write-Success "Inno Setup gefunden"
    } else {
        Write-Error "Inno Setup nicht gefunden unter: $InnoSetupPath"
        Write-Host "Bitte installieren Sie Inno Setup 6 von: https://jrsoftware.org/isinfo.php" -ForegroundColor Yellow
        exit 1
    }
}

function Clean-Build {
    Write-Step "Bereinige Build-Verzeichnisse..."

    $dirsToClean = @(
        (Join-Path $ProjectRoot "services\*\dist"),
        (Join-Path $ProjectRoot "packages\*\dist"),
        $OutputDir
    )

    foreach ($dir in $dirsToClean) {
        if (Test-Path $dir) {
            Remove-Item -Recurse -Force $dir
            Write-Success "Gelöscht: $dir"
        }
    }
}

function Build-Application {
    Write-Step "Baue Omni Control Suite..."

    Push-Location $ProjectRoot

    try {
        # Abhängigkeiten installieren
        Write-Host "Installiere Abhängigkeiten..." -ForegroundColor Yellow
        & pnpm install
        if ($LASTEXITCODE -ne 0) { throw "pnpm install fehlgeschlagen" }

        # Alle Services bauen
        Write-Host "Baue alle Services..." -ForegroundColor Yellow
        & pnpm run build
        if ($LASTEXITCODE -ne 0) { throw "Build fehlgeschlagen" }

        Write-Success "Build erfolgreich abgeschlossen"
    } finally {
        Pop-Location
    }
}

function Create-Installer {
    Write-Step "Erstelle Windows-Installer..."

    # Erstelle Output-Verzeichnis
    if (!(Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir | Out-Null
    }

    # Inno Setup ausführen
    $arguments = "`"$InstallerScript`" /O`"$OutputDir`""
    $process = Start-Process -FilePath $InnoSetupPath -ArgumentList $arguments -Wait -PassThru -NoNewWindow

    if ($process.ExitCode -eq 0) {
        Write-Success "Installer erfolgreich erstellt"

        # Zeige erstellte Dateien
        $installerFiles = Get-ChildItem $OutputDir -Filter "*.exe"
        foreach ($file in $installerFiles) {
            Write-Host "  → $($file.FullName)" -ForegroundColor Green
            Write-Host "    Größe: $([math]::Round($file.Length / 1MB, 2)) MB" -ForegroundColor Gray
        }
    } else {
        Write-Error "Installer-Erstellung fehlgeschlagen (Exit Code: $($process.ExitCode))"
        exit 1
    }
}

function Show-Summary {
    Write-Step "Build-Zusammenfassung"

    Write-Host "Projekt: Omni Control Suite v1.0.0" -ForegroundColor White
    Write-Host "Build-Verzeichnis: $ProjectRoot" -ForegroundColor White
    Write-Host "Installer-Verzeichnis: $OutputDir" -ForegroundColor White

    if (Test-Path $OutputDir) {
        $installerFiles = Get-ChildItem $OutputDir -Filter "*.exe"
        if ($installerFiles) {
            Write-Host "`nFertig installierbare Dateien:" -ForegroundColor Green
            foreach ($file in $installerFiles) {
                Write-Host "  📦 $($file.Name) ($([math]::Round($file.Length / 1MB, 2)) MB)" -ForegroundColor Cyan
            }
        }
    }

    Write-Host "`nVerwendung:" -ForegroundColor Yellow
    Write-Host "  1. Führen Sie die .exe-Datei als Administrator aus" -ForegroundColor White
    Write-Host "  2. Folgen Sie den Installationsanweisungen" -ForegroundColor White
    Write-Host "  3. Starten Sie die Anwendung über Desktop-Verknüpfung" -ForegroundColor White
}

# Hauptlogik
Write-Host "🚀 Omni Control Suite - Installer Builder" -ForegroundColor Magenta
Write-Host "=" * 50 -ForegroundColor Magenta

if ($Clean) {
    Clean-Build
    exit 0
}

Test-Prerequisites

if ($Build -or !$Package) {
    Clean-Build
    Build-Application
}

if ($Package -or !$Build) {
    Create-Installer
}

Show-Summary

Write-Host "`n🎉 Build-Prozess abgeschlossen!" -ForegroundColor Green