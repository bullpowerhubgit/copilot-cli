# 🌐 Copilot Universal Assistant

**Der ultimative AI-Assistent für Windows - funktioniert mit JEDER App!**

![Platform](https://img.shields.io/badge/Platform-Windows-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Was ist das?

Ein **system-weiter AI-Assistent**, der in jeder Windows-Anwendung funktioniert - egal ob Word, Browser, Notepad, VS Code, oder jede andere App!

### ⭐ Hauptfeatures:

- 🌍 **Funktioniert ÜBERALL** - In Word, Excel, Browser, Notepad, jeder App!
- ⌨️ **Globale Hotkeys** - Rufe den Assistenten von überall auf
- 📋 **Zwischenablage-Integration** - Analysiere Text aus jeder App
- 🖥️ **Overlay-Fenster** - Schwebt über allen Anwendungen
- ⌨️ **Auto-Type** - Fügt Antworten direkt in aktive App ein
- 📸 **Screenshot-Analyse** - Erfasse und analysiere Bildschirminhalte
- 🔒 **System Tray** - Läuft diskret im Hintergrund
- 🚀 **Autostart** - Startet automatisch mit Windows
- 💎 **17 kostenlose AI-Modelle**

## 🚀 Installation

### Schnellstart:

```powershell
# 1. In den Universal-Ordner wechseln
cd universal

# 2. Dependencies installieren
npm install

# 3. Starten!
npm start
```

### Als Windows-App installieren:

```powershell
# Installierbare App bauen
npm run build:win
```

Danach findest du im `dist/` Ordner:
- **Installer (NSIS)** - Klassische Windows-Installation
- **Portable Version** - Ohne Installation ausführbar

## ⌨️ Globale Tastenkombinationen

Diese funktionieren **in jeder Windows-Anwendung**:

| Hotkey | Funktion |
|--------|----------|
| **Ctrl+Shift+A** | Copilot-Overlay öffnen/schließen |
| **Ctrl+Shift+C** | Text aus Zwischenablage analysieren |
| **Ctrl+Shift+V** | Letzte AI-Antwort in App einfügen |
| **Ctrl+Shift+S** | Screenshot erstellen & analysieren |

## 💡 Verwendungsbeispiele

### 1️⃣ Text in Word analysieren

1. Markiere Text in Word
2. Drücke **Ctrl+C** (kopieren)
3. Drücke **Ctrl+Shift+C**
4. AI analysiert den Text automatisch!
5. Drücke **Ctrl+Shift+V** um Antwort einzufügen

### 2️⃣ Code-Hilfe in VS Code

1. Öffne Copilot mit **Ctrl+Shift+A**
2. Stelle deine Frage
3. Drücke **Enter**
4. Klicke "⌨️ Einfügen" um Code direkt einzufügen

### 3️⃣ E-Mail-Entwurf verbessern

1. Schreibe E-Mail in Outlook/Gmail
2. Kopiere Text (**Ctrl+C**)
3. **Ctrl+Shift+C** → "Verbessere diesen Text"
4. **Ctrl+Shift+V** → Fertig!

### 4️⃣ Screenshot analysieren

1. **Ctrl+Shift+S** drücken
2. AI analysiert den Screenshot
3. Stelle Fragen dazu
4. Füge Antworten direkt ein

## 🔧 Einrichtung

### 1. API-Key konfigurieren

1. Starte die App
2. Klicke aufs **System Tray Icon** (unten rechts)
3. Wähle **"Einstellungen"**
4. Füge deinen API-Key ein (siehe unten)
5. Klicke **"Speichern"**

### 2. Kostenlosen API-Key bekommen

#### Groq (Empfohlen - sehr schnell!):
1. Gehe zu https://console.groq.com
2. Erstelle Account
3. Generiere API-Key
4. Füge in Einstellungen ein

#### Google Gemini (Großzügig):
1. Gehe zu https://makersuite.google.com/app/apikey
2. Mit Google anmelden
3. API-Key erstellen
4. In Einstellungen einfügen

#### Ollama (Lokal - kein Key!):
1. Installiere https://ollama.ai
2. `ollama pull llama3.1`
3. `ollama serve`
4. Fertig!

### 3. Autostart aktivieren

1. Öffne Einstellungen
2. Aktiviere "🚀 Automatisch mit Windows starten"
3. Speichern

## 🎨 Features im Detail

### Overlay-Fenster
- **Transparent & Modern** - Dark Mode Design
- **Immer im Vordergrund** - Über allen Apps
- **Verschiebbar** - Positioniere wo du willst
- **Minimierbar** - Versteckt sich bei Bedarf

### Zwischenablage-Integration
- **Automatische Erkennung** - Kopierter Text wird erkannt
- **Direktes Einfügen** - Antworten landen in aktiver App
- **Keine manuelle Kopie nötig** - Alles automatisch

### Auto-Type Funktion
- **Simuliert Tastatur** - Fügt Text als Tastenanschläge ein
- **Funktioniert überall** - In jeder App die Text akzeptiert
- **Ctrl+V Simulation** - Nutzt Zwischenablage clever

### System Tray
- **Diskret** - Läuft im Hintergrund
- **Schnellzugriff** - Rechtsklick für Menü
- **Ein-Klick Start** - Linksklick öffnet Overlay

## 🎯 Verfügbare AI-Modelle

Alle 17 kostenlosen Modelle sind verfügbar:

### ⚡ Groq (Blitzschnell!)
- Llama 3.1 70B (empfohlen)
- Llama 3.3 70B
- Mixtral 8x7B
- Gemma 2 9B

### 💎 Google Gemini
- Gemini 1.5 Flash
- Gemini 1.5 Pro

### 🏠 Ollama (Lokal & Privat)
- Llama 3.1
- Mistral
- CodeLlama
- Gemma 2

### 🌐 OpenRouter & 🤗 Hugging Face
- GPT-3.5, Claude, Mistral, Zephyr, etc.

## 📁 Projektstruktur

```
universal/
├── main.js              # Electron Main Process (Backend)
├── preload.js           # IPC Bridge
├── overlay.html         # Overlay UI
├── renderer.js          # Frontend-Logik
├── styles.css           # UI-Design
├── ai-provider.js       # AI-Integration
├── package.json         # Dependencies
└── assets/              # Icons
```

## 🛠️ Entwicklung

### Dev-Modus:
```powershell
npm run dev
```

### Build erstellen:
```powershell
npm run build:win
```

### Dependencies aktualisieren:
```powershell
npm install
```

## 💻 Systemanforderungen

- **OS**: Windows 10/11
- **Node.js**: v18 oder höher
- **RAM**: Min. 4GB (8GB empfohlen)
- **Internet**: Für Cloud-Modelle (Ollama läuft offline)

## 🔒 Sicherheit & Privatsphäre

- ✅ Alle API-Keys werden **lokal** gespeichert
- ✅ Keine Telemetrie oder Tracking
- ✅ Open-Source - Du siehst den Code
- ✅ Ollama-Option für 100% lokale Nutzung

## 🐛 Fehlerbehebung

**"Hotkeys funktionieren nicht"**
- Starte die App als Administrator
- Prüfe ob andere Apps die Hotkeys nutzen

**"Kann nicht in App einfügen"**
- Stelle sicher die Ziel-App ist im Fokus
- Manche Apps blockieren Auto-Type (Sicherheit)

**"API-Key Fehler"**
- Prüfe Key in Einstellungen
- Stelle sicher Key ist aktiv

**"Overlay erscheint nicht"**
- Drücke **Ctrl+Shift+A** mehrmals
- Prüfe System Tray Icon

**"robotjs Installation schlägt fehl"**
```powershell
npm install --global windows-build-tools
npm install
```

## 🆚 Vergleich der Versionen

| Feature | CLI | Desktop | **Universal** |
|---------|-----|---------|---------------|
| Interface | Terminal | Fenster | **Overlay** |
| Hotkeys | Keine | Keine | **✅ Global** |
| App-Integration | Nein | Nein | **✅ Alle Apps** |
| Auto-Type | Nein | Nein | **✅ Ja** |
| Clipboard | Manuell | Manuell | **✅ Auto** |
| Screenshot | Nein | Nein | **✅ Ja** |
| System Tray | Nein | Nein | **✅ Ja** |
| Autostart | Nein | Nein | **✅ Ja** |

**Die Universal-Version ist die mächtigste!** 🚀

## 📝 Verwendungsszenarien

### 📧 E-Mail & Kommunikation
- Texte verbessern in Outlook/Gmail
- Antworten generieren
- Rechtschreibung prüfen

### 📄 Dokumente
- Word-Texte analysieren
- Excel-Formeln erklären
- PowerPoint-Inhalte generieren

### 💻 Programmierung
- Code erklären in VS Code
- Fehler debuggen
- Funktionen generieren

### 🌐 Web-Browsing
- Texte zusammenfassen
- Fragen zu Inhalten
- Übersetzungen

### 📚 Lernen & Recherche
- Komplexe Themen erklären
- Zusammenfassungen erstellen
- Fragen beantworten

## 🎓 Tipps & Tricks

1. **Pinne das Overlay** - Positioniere es rechts am Bildschirm
2. **Nutze Shortcuts** - Schneller als Maus
3. **Ollama für Offline** - Perfekt für unterwegs
4. **Autostart aktivieren** - Immer verfügbar
5. **Verschiedene Modelle** - Jedes hat Stärken

## 🤝 Beitragen

Feedback und Pull Requests willkommen!

## 📄 Lizenz

MIT License - siehe [LICENSE.md](../LICENSE.md)

## ⚠️ Hinweis

Dies ist ein inoffizielles Projekt und steht in keiner Verbindung mit GitHub's offiziellem Copilot.

---

## 🎉 Los geht's!

```powershell
cd universal
npm install
npm start
```

**Drücke Ctrl+Shift+A und erlebe AI in jeder App!** 🚀

---

**Made with ❤️ for Windows Power Users**
