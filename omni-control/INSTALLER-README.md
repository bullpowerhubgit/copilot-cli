# Omni Control Suite - Installationsanleitung

## Übersicht

Die **Omni Control Suite** ist eine umfassende Remote-Access & Automatisierungsplattform, die es Ihnen ermöglicht, Systeme remote zu steuern und zu überwachen.

## Systemanforderungen

- **Betriebssystem**: Windows 10/11 (64-bit)
- **Node.js**: Version 20.0 oder höher
- **Speicherplatz**: Mindestens 500 MB freier Speicherplatz
- **RAM**: Mindestens 4 GB RAM empfohlen

## Installation

1. **Node.js installieren** (falls nicht vorhanden):
   - Besuchen Sie https://nodejs.org
   - Laden Sie die LTS-Version herunter
   - Führen Sie den Installer aus

2. **Omni Control Suite installieren**:
   - Führen Sie `Omni-Control-Suite-Setup.exe` aus
   - Folgen Sie den Installationsanweisungen
   - Der Installer überprüft automatisch die Systemanforderungen

3. **Erstmaliger Start**:
   - Verwenden Sie die Desktop-Verknüpfung oder das Startmenü
   - Die Anwendung startet automatisch alle erforderlichen Dienste

## Verwendung

### Schnellstart
- Doppelklicken Sie auf die Desktop-Verknüpfung "Omni Control Suite"
- Die Anwendung startet alle Dienste und öffnet die Web-Konsole automatisch

### Manuelle Steuerung
- **start-services.bat**: Startet alle Dienste manuell
- **stop-services.bat**: Stoppt alle laufenden Dienste

## Zugriffe

Nach dem Start sind folgende Dienste verfügbar:

- **Web-Konsole**: http://localhost:4173
- **Gateway API**: http://localhost:9443
- **Agent-ID**: test-agent-001 (für Entwicklung)

## Konfiguration

Die Hauptkonfiguration befindet sich in der Datei `.env` im Installationsverzeichnis:

```env
NODE_ENV=production
CONTROLHUB_URL=https://localhost:9443
JWT_SECRET=[automatisch generiert]
AGENT_TOKEN=[automatisch generiert]
AGENT_ID=test-agent-001
```

## Sicherheit

- **JWT-Secrets** werden automatisch während der Installation generiert
- **Standard-Ports** können bei Bedarf angepasst werden
- **Firewall-Einstellungen** müssen den Zugriff auf die konfigurierten Ports erlauben

## Problembehandlung

### Dienste starten nicht
- Überprüfen Sie, ob Node.js korrekt installiert ist
- Kontrollieren Sie die Firewall-Einstellungen
- Prüfen Sie die Konsolen-Ausgaben auf Fehlermeldungen

### Web-Konsole nicht erreichbar
- Stellen Sie sicher, dass Port 4173 nicht blockiert ist
- Überprüfen Sie, ob der Console-Dienst läuft
- Versuchen Sie einen Browser-Neustart

### Agent-Verbindung fehlgeschlagen
- Überprüfen Sie die Gateway-Verbindung (Port 9443)
- Kontrollieren Sie die JWT-Token-Konfiguration
- Prüfen Sie die Netzwerkverbindung

## Deinstallation

- Verwenden Sie die Windows-Systemsteuerung → Programme und Features
- Oder verwenden Sie die Deinstallationsoption im Startmenü

## Support

Bei Problemen oder Fragen:
- Überprüfen Sie die Konsolen-Ausgaben auf Fehlermeldungen
- Stellen Sie sicher, dass alle Systemanforderungen erfüllt sind
- Kontaktieren Sie den Support unter [support@omni-control.local]

## Lizenz

Dieses Produkt ist unter der MIT-Lizenz veröffentlicht.

---

**Omni Control Team** - Remote Access & Automation Platform