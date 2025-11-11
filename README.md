# 🤖 Kostenloser Copilot CLI Client

Ein **kostenloser** AI-gestützter Kommandozeilen-Assistent mit ähnlichen Funktionen wie GitHub Copilot CLI - aber komplett gratis!

## ✨ Features

- 🆓 **100% Kostenlos** - Nutzt kostenlose AI-Modelle (Groq, OpenRouter, Hugging Face)
- 💬 **Interaktiver Chat** - Stelle Fragen und erhalte sofort Antworten
- 🎨 **Schöne CLI-Oberfläche** - Mit Farben und übersichtlicher Darstellung
- 🔄 **Konversationshistorie** - Der Assistent merkt sich den Kontext
- 🚀 **Schnell & Einfach** - Keine komplizierte Einrichtung

## 🚀 Schnellstart

### Voraussetzungen

- **Node.js** v18 oder höher
- **npm** v8 oder höher
- **Visual Studio Code** (empfohlen)

### Installation

```bash
# 1. Repository klonen oder herunterladen
cd copilot-cli

# 2. Dependencies installieren
npm install

# 3. API-Key konfigurieren (siehe unten)
cp .env.example .env
# Bearbeite .env und füge deinen kostenlosen API-Key hinzu

# 4. Starten!
npm start
```

### 🎯 Mit Visual Studio Code (Empfohlen!)

**Einfachster Weg:**
1. Öffne das Projekt in VS Code
2. Drücke **F5**
3. Fertig! 🎉

Siehe [VSCODE.md](VSCODE.md) für detaillierte VS Code Anleitungen.

### Globale Installation (Optional)

```bash
npm link
copilot-client
```

## 🔑 Kostenlose API-Keys einrichten

Du brauchst mindestens einen kostenlosen API-Key von einem dieser Anbieter:

### ⚡ Option 1: Groq (Empfohlen - extrem schnell!)

**Warum Groq?** Blitzschnelle Antworten, komplett kostenlos, keine Kreditkarte nötig!

1. Gehe zu https://console.groq.com
2. Erstelle einen kostenlosen Account
3. Navigiere zu "API Keys" und generiere einen neuen Key
4. Füge ihn in die `.env` Datei ein:
   ```
   GROQ_API_KEY=gsk_...
   ```

### 💎 Option 2: Google Gemini (Sehr großzügiges kostenloses Limit)

1. Gehe zu https://makersuite.google.com/app/apikey
2. Melde dich mit deinem Google-Konto an
3. Erstelle einen API-Key
4. Füge ihn in die `.env` Datei ein:
   ```
   GOOGLE_API_KEY=AIza...
   ```

### 🌐 Option 3: OpenRouter (Viele Modelle zur Auswahl)

1. Gehe zu https://openrouter.ai
2. Erstelle einen Account
3. Generiere einen API-Key (bekomme kostenlose Credits!)
4. Füge ihn in die `.env` Datei ein:
   ```
   OPENROUTER_API_KEY=sk-or-...
   ```

### 🤗 Option 4: Hugging Face (Open-Source Modelle)

1. Gehe zu https://huggingface.co/settings/tokens
2. Erstelle einen Access Token (Read-Rechte reichen)
3. Füge ihn in die `.env` Datei ein:
   ```
   HUGGINGFACE_API_KEY=hf_...
   ```

### 🏠 Option 5: Ollama (100% Lokal - kein API-Key nötig!)

**Perfekt für Privatsphäre und Offline-Nutzung!**

1. Installiere Ollama: https://ollama.ai
2. Führe im Terminal aus:
   ```powershell
   ollama pull llama3.1
   ollama serve
   ```
3. Fertig! Kein API-Key nötig, läuft komplett lokal auf deinem PC

## 📖 Verwendung

### Starten

```bash
npm start
```

oder (wenn global installiert):

```bash
copilot-client
```

### Mit Banner starten

```bash
npm start -- --banner
```

### Verfügbare Befehle

Während der Client läuft, kannst du folgende Befehle verwenden:

- `/help` - Zeigt alle verfügbaren Befehle
- `/model` - Wähle ein anderes AI-Modell
- `/config` - Zeige aktuelle Konfiguration
- `/clear` - Lösche die Konversationshistorie
- `/feedback` - Gib Feedback
- `/exit` - Beende den Client

### Beispiel-Konversation

```
Du: Wie erstelle ich eine Node.js-Anwendung?

Assistent: Ich helfe dir gerne! Hier sind die Schritte...

Du: Kannst du mir ein Beispiel zeigen?

Assistent: Natürlich! Hier ist ein einfaches Beispiel...
```

## 🎯 Verfügbare AI-Modelle

Der Client unterstützt **17 verschiedene kostenlose AI-Modelle**!

### ⚡ Groq Modelle (Extrem schnell!)
- **Llama 3.1 70B** - Groß, leistungsstark, schnell (empfohlen!)
- **Llama 3.3 70B** - Neueste Version mit verbesserten Fähigkeiten
- **Mixtral 8x7B** - Sehr gut für komplexe Aufgaben
- **Gemma 2 9B** - Schnell und effizient

### 💎 Google Gemini Modelle (Großzügiges Limit)
- **Gemini 1.5 Flash** - Blitzschnell, kostenlos
- **Gemini 1.5 Pro** - Noch leistungsstärker

### 🌐 OpenRouter Modelle (Viele Optionen)
- **GPT-3.5 Turbo** - Mit Credits nutzbar
- **Claude 3 Haiku** - Schnell und präzise
- **Mistral 7B** - Komplett kostenlos
- **Llama 3.1 8B** - Kostenlose Version

### 🤗 Hugging Face Modelle (Open-Source)
- **Llama 2 7B** - Bewährt und zuverlässig
- **Mistral 7B** - Sehr gute Qualität
- **Zephyr 7B** - Optimiert für Chats

### 🏠 Ollama Modelle (100% Lokal!)
- **Llama 3.1** - Keine Internet-Verbindung nötig
- **Mistral** - Schnell und privat
- **CodeLlama** - Spezialisiert auf Code
- **Gemma 2** - Neuestes lokales Modell

**Wechsle jederzeit zwischen den Modellen mit dem `/model` Befehl!**

## 📁 Projektstruktur

```
copilot-cli/
├── src/                  # CLI-Version (Terminal)
│   ├── index.js          # Haupteinstiegspunkt
│   ├── interactive.js    # Interaktiver Chat-Modus
│   ├── ai-provider.js    # AI-Provider-Integration
│   ├── config.js         # Konfigurationsverwaltung
│   └── banner.js         # ASCII-Banner
├── desktop/              # Desktop-Version (GUI)
│   ├── main.js           # Electron Main Process
│   ├── renderer.js       # Frontend-Logik
│   ├── index.html        # Grafische Oberfläche
│   ├── styles.css        # Design
│   └── README.md         # Desktop-Dokumentation
├── universal/            # Universal-Version ⭐ NEU!
│   ├── main.js           # System-weite Integration
│   ├── overlay.html      # Overlay-Interface
│   ├── renderer.js       # Overlay-Logik
│   ├── styles.css        # Overlay-Design
│   └── README.md         # Universal-Dokumentation
├── .vscode/              # VS Code Konfiguration
├── .env.example          # Beispiel-Umgebungsvariablen
├── package.json          # Projektinformationen (CLI)
└── README.md             # Diese Datei
```

## 🌟 3 Versionen verfügbar!

### 1️⃣ CLI-Version (Terminal)
Für Entwickler und Terminal-Fans
```powershell
npm start
```

### 2️⃣ Desktop-Version (Grafische App)
Schöne GUI für alle Nutzer
```powershell
cd desktop
npm install
npm start
```

### 3️⃣ Universal-Version (System-weit) ⭐ EMPFOHLEN!
**Funktioniert in JEDER Windows-App!**
```powershell
cd universal
npm install
npm start
```

### Welche Version ist die richtige?

| Feature | CLI | Desktop | **Universal** |
|---------|-----|---------|---------------|
| Interface | Terminal | Fenster | **Overlay** |
| Hotkeys (global) | ❌ | ❌ | **✅** |
| Funktioniert in allen Apps | ❌ | ❌ | **✅** |
| Auto-Type in Apps | ❌ | ❌ | **✅** |
| Zwischenablage-Auto | ❌ | ❌ | **✅** |
| Screenshot-Analyse | ❌ | ❌ | **✅** |
| System Tray | ❌ | ❌ | **✅** |
| Windows-Autostart | ❌ | ❌ | **✅** |

**🎯 Empfehlung: Universal-Version für maximale Power!**

Siehe:
- [CLI README](src/README.md)
- [Desktop README](desktop/README.md)
- [Universal README](universal/README.md) ⭐

Alle Versionen nutzen dieselben 17 kostenlosen AI-Modelle!

## � Neu: Omni Control Suite (All-in-One Fernzugriff)

Für umfassenden PC-Fernzugriff, Automatisierung und KI-gesteuerte Steuerung steht nun ein komplett neues Projekt bereit:

- `omni-control/` – Control Hub, Remote Agent, Web-Konsole, Automations-Bridges
- Vollständiges Docker-Setup (Gateway, Console, n8n, Browserless)
- MCPControl-Anbindung und Intel AMT/KVM Adapter (Preview)

👉 Details und Setup: `omni-control/README.md`

## �🛠️ Entwicklung

```bash
# Im Watch-Modus entwickeln
npm run dev

# Normal starten
npm start
```

## 💡 Tipps

- **Groq Llama 3.1 70B** ist am schnellsten und wird empfohlen für beste Performance
- **Google Gemini Flash** hat ein sehr großzügiges kostenloses Limit
- **Ollama** ist perfekt wenn du offline arbeiten oder maximale Privatsphäre möchtest
- Die Konversationshistorie bleibt während einer Session erhalten
- Nutze `/clear` um die Historie zu löschen und neu zu starten
- Probiere verschiedene Modelle aus - jedes hat seine Stärken!
- Alle Cloud-API-Keys sind kostenlos erhältlich!

## 🤝 Beitragen

Feedback und Beiträge sind willkommen! Öffne einfach ein Issue oder Pull Request.

## 📄 Lizenz

MIT License - siehe [LICENSE.md](LICENSE.md)

## ⚠️ Hinweis

Dies ist ein inoffizielles Projekt und steht in keiner Verbindung mit GitHub's offiziellem Copilot CLI. Es handelt sich um eine kostenlose Alternative für Entwickler.

---

**Viel Spaß beim Coden! 🚀**

