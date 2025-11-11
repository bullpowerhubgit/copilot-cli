# Omni Control Suite - Installer-Erstellung

## Übersicht

Dieses Verzeichnis enthält alles Notwendige, um eine fertig installierbare Windows-Setup-Datei (.exe) für die Omni Control Suite zu erstellen.

## Voraussetzungen

Bevor Sie den Installer erstellen können, müssen folgende Software-Komponenten installiert sein:

### 1. Node.js (erforderlich)
- **Download**: https://nodejs.org (LTS-Version empfohlen)
- **Mindestversion**: 20.0.0
- **Verifizierung**: `node --version`

### 2. pnpm (erforderlich)
- **Installation**: `npm install -g pnpm`
- **Verifizierung**: `pnpm --version`

### 3. Inno Setup 6 (erforderlich)
- **Download**: https://jrsoftware.org/isinfo.php
- **Version**: 6.x (kostenlos)
- **Installationspfad**: `C:\Program Files (x86)\Inno Setup 6\`

## Installer erstellen

### Option 1: Batch-Script (empfohlen für Windows)
```cmd
build-installer.bat
```

### Option 2: PowerShell-Script (erweiterte Optionen)
```powershell
.\build-installer.ps1
```

### Option 3: Manuell Schritt für Schritt
```cmd
# 1. Abhängigkeiten installieren
pnpm install

# 2. Anwendung bauen
pnpm run build

# 3. Installer erstellen
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss
```

## Erstellte Dateien

Nach erfolgreichem Build finden Sie im `installer/`-Verzeichnis:

- `Omni-Control-Suite-Setup.exe` - Die fertig installierbare Setup-Datei
- Zusätzliche Installer-Dateien und -Konfigurationen

## Installer-Funktionen

Der erstellte Installer bietet:

- ✅ Automatische Systemanforderungs-Prüfung (Node.js)
- ✅ Professionelle Installationsoberfläche
- ✅ Desktop-Verknüpfung erstellen (optional)
- ✅ Automatische Abhängigkeitsinstallation während Setup
- ✅ Saubere Deinstallation über Windows-Systemsteuerung
- ✅ Mehrsprachige Unterstützung (Deutsch/Englisch)

## Installation testen

Nach Erstellung des Installers:

1. **Test-Installation**:
   - Führen Sie `Omni-Control-Suite-Setup.exe` als Administrator aus
   - Installieren Sie in ein separates Test-Verzeichnis

2. **Funktionalität prüfen**:
   - Starten Sie die Anwendung über die Desktop-Verknüpfung
   - Überprüfen Sie alle Dienste (Gateway, Agent, Console)
   - Testen Sie die Web-Konsole: http://localhost:4173

## Anpassungen

### Icon ändern
- Ersetzen Sie `icon.ico` durch Ihr eigenes Icon
- Verwenden Sie das `.ico`-Format mit mehreren Größen (16x16 bis 256x256)

### Version ändern
- Bearbeiten Sie `installer.iss`
- Ändern Sie `#define MyAppVersion "1.0.0"`

### Zusätzliche Dateien hinzufügen
- Fügen Sie Dateien im `[Files]`-Abschnitt der `installer.iss` hinzu

## Fehlerbehebung

### "Node.js nicht gefunden"
- Stellen Sie sicher, dass Node.js installiert und im PATH ist
- Starten Sie die Eingabeaufforderung neu

### "pnpm nicht gefunden"
- Installieren Sie pnpm: `npm install -g pnpm`
- Starten Sie die Eingabeaufforderung neu

### "Inno Setup nicht gefunden"
- Installieren Sie Inno Setup 6
- Überprüfen Sie den Installationspfad

### Build-Fehler
- Löschen Sie `node_modules` und führen Sie `pnpm install` erneut aus
- Überprüfen Sie die Konsolen-Ausgaben auf spezifische Fehlermeldungen

## Support

Bei Problemen:
1. Überprüfen Sie die Fehlerausgaben der Build-Scripte
2. Stellen Sie sicher, dass alle Voraussetzungen erfüllt sind
3. Testen Sie jeden Schritt manuell

## Lizenz

Der Installer und die Build-Scripte sind unter der MIT-Lizenz veröffentlicht.