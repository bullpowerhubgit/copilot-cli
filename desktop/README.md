# 🖥️ Copilot Desktop Client

Eine **kostenlose Desktop-Anwendung** mit grafischer Benutzeroberfläche für AI-Assistenz!

![Desktop App](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎨 **Moderne grafische Oberfläche** - Dark Mode Design
- 💬 **Echtzeit-Chat** - Flüssiges Konversationserlebnis
- 🚀 **17 kostenlose AI-Modelle** - Groq, Google Gemini, Ollama, etc.
- 💾 **Chat-Export** - Speichere deine Konversationen
- ⚙️ **Einfache Konfiguration** - API-Keys direkt in der App verwalten
- 📊 **Statistiken** - Behalte den Überblick über deine Chats
- 🔒 **Sicher** - Alle Daten bleiben lokal auf deinem PC

## 📦 Installation

### Option 1: Von Source ausführen (Entwicklung)

```powershell
# 1. In den Desktop-Ordner wechseln
cd desktop

# 2. Dependencies installieren
npm install

# 3. App starten
npm start
```

### Option 2: Installierbare App bauen

```powershell
# Für Windows
npm run build:win

# Für macOS
npm run build:mac

# Für Linux
npm run build:linux

# Für alle Plattformen
npm run build:all
```

Die fertigen Installer findest du dann im `dist/` Ordner!

## 🚀 Schnellstart

### 1. App starten
```powershell
cd desktop
npm install
npm start
```

### 2. API-Key konfigurieren
1. Klicke auf **⚙️ Einstellungen**
2. Füge deinen kostenlosen API-Key ein (z.B. von Groq)
3. Klicke auf **Speichern**

### 3. Modell wählen
- Wähle ein Modell aus dem Dropdown in der Sidebar
- Empfohlen: **⚡ Groq Llama 3.1 70B**

### 4. Chatten!
- Tippe deine Frage ins Textfeld
- Drücke **Enter** zum Senden
- **Shift+Enter** für eine neue Zeile

## 🎯 Verfügbare Modelle

Die Desktop-App unterstützt alle 17 kostenlosen Modelle:

### ⚡ Groq (Sehr schnell!)
- Llama 3.1 70B
- Llama 3.3 70B
- Mixtral 8x7B
- Gemma 2 9B

### 💎 Google Gemini
- Gemini 1.5 Flash
- Gemini 1.5 Pro

### 🏠 Ollama (Lokal)
- Llama 3.1
- Mistral
- CodeLlama
- Gemma 2

### 🌐 OpenRouter
- GPT-3.5 Turbo
- Claude 3 Haiku
- Mistral 7B
- Llama 3.1 8B

### 🤗 Hugging Face
- Llama 2
- Mistral 7B
- Zephyr 7B

## 🔑 API-Keys einrichten

### Groq (Empfohlen)
1. Gehe zu https://console.groq.com
2. Erstelle einen Account
3. Generiere einen API-Key
4. Füge ihn in den Einstellungen ein

### Google Gemini
1. Gehe zu https://makersuite.google.com/app/apikey
2. Melde dich an
3. Erstelle einen API-Key
4. Füge ihn in den Einstellungen ein

### Ollama (Lokal - kein Key nötig!)
1. Installiere Ollama von https://ollama.ai
2. Führe aus: `ollama pull llama3.1`
3. Starte Ollama: `ollama serve`
4. Fertig!

## ⌨️ Tastenkombinationen

| Taste | Aktion |
|-------|--------|
| **Enter** | Nachricht senden |
| **Shift+Enter** | Neue Zeile |
| **Ctrl+L** | Chat löschen |
| **Ctrl+,** | Einstellungen öffnen |
| **Ctrl+E** | Chat exportieren |

## 📁 Projektstruktur

```
desktop/
├── main.js              # Electron Main Process
├── preload.js           # Preload Script (IPC Bridge)
├── renderer.js          # Frontend-Logik
├── ai-provider.js       # AI-Provider-Integration
├── index.html           # Haupt-UI
├── styles.css           # Styling
├── package.json         # Dependencies
└── assets/              # Icons & Bilder
```

## 🛠️ Entwicklung

### Dev-Modus starten
```powershell
npm run dev
```

### DevTools öffnen
Die App startet automatisch mit DevTools im Dev-Modus (`--dev` Flag)

### Änderungen testen
1. Ändere Code in `renderer.js`, `index.html` oder `styles.css`
2. Drücke `Ctrl+R` in der App zum Neu-laden
3. Für `main.js` Änderungen: App neu starten

## 📦 App-Build Konfiguration

Die App kann für verschiedene Plattformen gebaut werden:

### Windows
- **NSIS Installer** - Klassischer Windows-Installer
- **Portable** - Ohne Installation ausführbar

### macOS
- **DMG** - Drag & Drop Installation
- **ZIP** - Komprimiertes Archiv

### Linux
- **AppImage** - Universal Linux Format
- **DEB** - Für Debian/Ubuntu

## 💡 Features im Detail

### Chat-Interface
- Markdown-Unterstützung (fett, kursiv, Code)
- Syntax-Highlighting für Code-Blöcke
- Auto-Scroll zu neuen Nachrichten
- Zeitstempel für jede Nachricht

### Einstellungen
- Persistente Speicherung mit electron-store
- Separate API-Keys für jeden Provider
- Ollama Host-Konfiguration

### Export
- Exportiere Chats als JSON
- Inkl. Timestamp und Modell-Info
- Importfunktion kann hinzugefügt werden

## 🐛 Fehlerbehebung

**"Electron nicht gefunden"**
```powershell
npm install electron --save-dev
```

**"API-Key Fehler"**
- Prüfe, ob der Key korrekt in den Einstellungen eingegeben wurde
- Stelle sicher, dass der Key aktiv ist

**"Ollama nicht erreichbar"**
```powershell
ollama serve
```

**"Modell lädt nicht"**
```powershell
ollama pull llama3.1
```

## 🎨 Anpassungen

### Design ändern
Bearbeite `styles.css` - alle Farben sind in CSS-Variablen definiert:
```css
:root {
    --bg-primary: #1e1e1e;
    --accent: #007acc;
    /* ... weitere Farben */
}
```

### Neue Modelle hinzufügen
Bearbeite `ai-provider.js` → `getAvailableModels()`

### Tastenkombinationen ändern
Bearbeite `renderer.js` → Event Listeners

## 📄 Lizenz

MIT License - siehe [LICENSE.md](../LICENSE.md)

## 🤝 Beitragen

Feedback und Pull Requests sind willkommen!

## ⚠️ Hinweis

Dies ist ein inoffizielles Projekt und steht in keiner Verbindung mit GitHub's offiziellem Copilot.

---

## 🆚 CLI vs Desktop

| Feature | CLI | Desktop |
|---------|-----|---------|
| Oberfläche | Terminal | Grafisch |
| Platform | Windows/Mac/Linux | Windows/Mac/Linux |
| Installation | npm global | Installer/Portable |
| Benutzerfreundlichkeit | Entwickler | Alle |
| API-Key Setup | .env Datei | GUI Einstellungen |
| Chat-Export | Manuell | Ein-Klick |

**Wähle CLI für:** Entwickler, Terminal-Fans, Scripting
**Wähle Desktop für:** Grafische UI, einfachere Bedienung, bessere UX

---

**Viel Spaß mit deinem Desktop AI-Assistenten! 🚀**
