# Omni Control Suite

Ein installationsfertiges All-in-One Fernzugriffs- und Automatisierungs-Framework, das Funktionen klassischer Remote-Desktop-Lösungen (TeamViewer, DWService, Chrome Remote Desktop) mit moderner Automatisierung (n8n, Browserless, UiPath, MCPControl, Intel AMT/KVM) und KI-Agenten kombiniert.

## Funktionsüberblick

- **Remote-Desktop & Steuerung**
  - Bildschirm-Streaming (WebRTC/HTTP-Streaming vorbereitet)
  - Maus- & Tastatursimulation über gesicherte Kanäle
  - Zwischenablage-Synchronisation (bidirektional)
  - Datei-Up/Download via verschlüsseltem Tunnel

- **Automatisierung & Orchestrierung**
  - Native REST/WebSocket-Schnittstellen für n8n Flows
  - Browser-Automatisierung via Browserless (Headless Chrome)
  - Integration von UiPath Bots über WebHooks
  - MCPControl-Bridge für KI-gesteuerte Systemautomation

- **KI-Agenten**
  - Unterstützung für Claude-, GPT-, Groq- und lokale Ollama-Modelle
  - Aufgabensteuerung über RAG-fähigen Automations-Hub
  - Kontextuelle Aktionen (z.B. „Starte neue Browser-Session“)

- **Hardware-Level Zugriff**
  - Optionaler Intel AMT/KVM Adapter (Out-of-Band Management)
  - Modul zur Remote-Power-Steuerung (ein/aus/reset)

- **Sicherheit & Verwaltung**
  - Zero-Trust Token-Authentifizierung
  - Ende-zu-Ende-Verschlüsselung der Sessions (TLS/mTLS)
  - Mandantenfähiger Control Hub mit rollenbasierter Rechteverwaltung
  - Audit-Logging, Session-Recording, Alarme

## Architektur

```
omni-control/
├── services/
│   ├── gateway/             # Control Hub & API Gateway
│   ├── agent/               # Lightweight Remote Agent (installierbar)
│   ├── console/             # Web-UI für Operatoren
│   ├── automations/         # Bridges zu n8n, Browserless, UiPath, MCPControl
│   └── amt-adapter/         # Intel AMT/KVM Out-of-Band Anbindung
├── infrastructure/
│   ├── docker-compose.yml   # Komplettes Deployment (Gateway, UI, n8n, Browserless)
│   └── k8s/                 # Kubernetes Manifeste (optional)
├── packages/
│   └── shared/              # Reusable Utils (Auth, Logging, Protocol)
└── README.md                # Diese Datei
```

## Schnellstart

### 1. Systemvoraussetzungen

- Node.js ≥ 20 LTS
- pnpm (empfohlen) oder npm v10+
- Docker Desktop (für Full-Stack Deployment)
- Windows 11 / Windows Server 2022 (Agent + Operator)
- Optional: Intel vPro/AMT fähige Hardware

### 2. Installation (lokales PoC)

```powershell
# Im Repo-Hauptverzeichnis
cd omni-control
pnpm install
pnpm run build

# Control Hub starten
pnpm --filter gateway dev

# Operator-Konsole starten
pnpm --filter console dev

# Agent auf Zielrechner
pnpm --filter agent package
# Installationspaket unter dist/agent-setup.exe
```

### 🟦 One-Click Setup (Windows)

```powershell
Set-Location omni-control
Set-ExecutionPolicy -Scope Process Bypass -Force
./scripts/OneClickInstaller.ps1
```

Was passiert dabei?
- Prüft Administratorrechte, Node.js ≥ 20, Docker Desktop, pnpm
- Erstellt `.env` inkl. zufälligem JWT-Secret & Operator-Token
- Führt `pnpm install` & Builds für Gateway, Automations, Agent, Console aus
- Startet den kompletten Stack via `docker compose up -d --build`
- Baut ein Agent-Bundle unter `artifacts/OmniControl-AgentBundle.zip`

Optional: `-SkipDockerBuild` und `-SkipAgentPackage` Parameter verfügbar.
EXE-Build (optional): `Install-Module ps2exe -Scope CurrentUser` und anschließend `ps2exe .\scripts\OneClickInstaller.ps1 .\dist\OmniControl-Setup.exe`.

### 3. Docker Deployment

```powershell
cd omni-control/infrastructure
docker compose up -d
```

Services:
- https://localhost:9443 → Control Hub & API Gateway
- https://localhost:3001 → Operator Console
- https://localhost:5678 → n8n Orchestrator
- ws://localhost:8080 → Browserless (Headless Chrome)

### 4. Agent knüpfen

```powershell
# Auf remote Client with Admin-Rechten
powershell -ExecutionPolicy Bypass -File .\omni-agent-install.ps1 -ServerUrl "https://controlhub.example.com" -AuthToken "<TOKEN>"
```

## Module im Detail

### Gateway Service (`services/gateway`)
- Express.js + Socket.IO API Gateway
- Nutzerverwaltung (JWT + Refresh Tokens)
- Session-Broker für Remote-Verbindungen
- REST-Hooks für n8n, UiPath, MCPControl

### Agent Service (`services/agent`)
- Leichtgewichtiger Node.js Dienst
- Features
  - `RemoteShell` (PowerShell Core)
  - `ScreenCapture` (screenshot-desktop + MJPEG Stream)
  - `InputControl` (robotjs, nut.js fallback)
  - `FileBridge` (schnelle Chunk-Up/Downloads)
  - `SystemMetrics` (CPU, RAM, Prozesse)
- Läuft als Windows Service (NSSM) oder Benutzer-Agent

### Automation Bridges (`services/automations`)
- n8n Flow Trigger → WebHook → Gateway
- Browserless Client → Start Headless Sessions
- UiPath Orchestrator Connector → Job Start/Stop
- MCPControl Relay → KI-Agenten orchestrieren Automationsaktionen

### AMT Adapter (`services/amt-adapter`)
- Nutzt `wsman` & `amt` Node Bibliotheken
- Power-Steuerung, Serienkonsole, SOL, KVM
- Fällt auf lokales Wake-on-LAN zurück, falls AMT nicht verfügbar

## Sicherheit

- mTLS zwischen Agent ↔ Gateway ↔ Operator
- FIPS-konforme Cipher Suites
- Role-Based Access Control (RBAC)
- Audit Trails pro Session (File Access, Befehle, Aktionen)
- Secrets via .env / HashiCorp Vault Integration

## Roadmap

1. 📡 WebRTC Low-Latency Desktop Streaming
2. 🤖 KI-gestützte Workflow-Empfehlungen
3. 🔐 Passkey (FIDO2) Login
4. 🧠 Plug-in Architektur für individuelle Automationsflüsse

## Haftungsausschluss

Dieses Projekt richtet sich an Administratoren und Power-User für legitimen Remote-Support und Automatisierung. Bitte beachte alle regulatorischen Vorgaben (z.B. DSGVO, ISO 27001) und hole Benutzerzustimmung ein.
