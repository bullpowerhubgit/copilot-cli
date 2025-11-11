@echo off
echo ========================================
echo Omni Control Suite - Installer Builder
echo ========================================
echo.

cd /d "%~dp0"

echo Überprüfe Voraussetzungen...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo FEHLER: Node.js ist nicht installiert oder nicht im PATH
    echo Bitte installieren Sie Node.js von https://nodejs.org
    pause
    exit /b 1
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo FEHLER: pnpm ist nicht installiert oder nicht im PATH
    echo Bitte installieren Sie pnpm: npm install -g pnpm
    pause
    exit /b 1
)

if not exist "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" (
    echo FEHLER: Inno Setup 6 nicht gefunden
    echo Bitte installieren Sie Inno Setup 6 von https://jrsoftware.org/isinfo.php
    pause
    exit /b 1
)

echo.
echo Bereinige alte Build-Dateien...
if exist installer rmdir /s /q installer
for /d %%i in (services\*\dist packages\*\dist) do if exist "%%i" rmdir /s /q "%%i"

echo.
echo Installiere Abhängigkeiten...
call pnpm install
if %errorlevel% neq 0 (
    echo FEHLER: Abhängigkeiten konnten nicht installiert werden
    pause
    exit /b 1
)

echo.
echo Baue alle Services...
call pnpm run build
if %errorlevel% neq 0 (
    echo FEHLER: Build fehlgeschlagen
    pause
    exit /b 1
)

echo.
echo Erstelle Windows-Installer...
if not exist installer mkdir installer
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss /Oinstaller
if %errorlevel% neq 0 (
    echo FEHLER: Installer konnte nicht erstellt werden
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installer erfolgreich erstellt!
echo ========================================
echo.
echo Suchen Sie die Installationsdatei in:
echo   %~dp0installer\
echo.
for %%f in (installer\*.exe) do echo   %%~nxf (%%~zf Bytes)
echo.
echo Installation:
echo   1. Führen Sie die .exe-Datei als Administrator aus
echo   2. Folgen Sie den Installationsanweisungen
echo   3. Starten Sie die Anwendung über die Desktop-Verknüpfung
echo.
pause