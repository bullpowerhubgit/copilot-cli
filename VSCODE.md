# 🎯 Visual Studio Code - Schnellstart

## ⚡ Sofort loslegen

Das Projekt ist jetzt komplett für VS Code konfiguriert!

### 3 Wege zum Starten:

#### 1️⃣ **Mit F5 (Empfohlen!)**
Drücke einfach **F5** und der Client startet automatisch im Debug-Modus!

#### 2️⃣ **Über das Run-Menü**
1. Klicke auf "Run and Debug" (▶️ Symbol in der Sidebar)
2. Wähle "🚀 Copilot Client starten"
3. Klicke auf den grünen Play-Button

#### 3️⃣ **Mit Tastenkombination**
Drücke **Ctrl+Shift+R** zum Starten

---

## 🎨 Verfügbare Debug-Konfigurationen

Klicke auf das Dropdown neben dem Play-Button:

- **🚀 Copilot Client starten** - Standard-Start
- **🎨 Mit Banner starten** - Zeigt das schöne ASCII-Banner
- **🔧 Mit spezifischem Modell starten** - Startet direkt mit Groq Llama
- **🐛 Debug Modus** - Für Entwickler mit erweiterten Logs

---

## 📋 Verfügbare Tasks

Öffne die Command Palette (**Ctrl+Shift+P**) und tippe "Run Task":

- **📦 Dependencies installieren** - Installiert npm-Pakete
- **🚀 Copilot Client starten** - Standard-Start (Default Task)
- **🔄 Dev Modus** - Startet mit Auto-Reload bei Änderungen
- **🎨 Mit Banner starten** - Mit ASCII-Banner
- **🔗 Global installieren** - Macht `copilot-client` global verfügbar
- **📝 .env Datei erstellen** - Kopiert .env.example zu .env
- **🎯 Vollständiges Setup** - Richtet alles automatisch ein

---

## ⌨️ Tastenkombinationen

| Taste | Aktion |
|-------|--------|
| **F5** | Startet den Client im Debug-Modus |
| **Ctrl+Shift+R** | Führt den Standard-Task aus |
| **Ctrl+Shift+P** | Öffnet Command Palette für Tasks |
| **Shift+F5** | Stoppt den laufenden Debug-Prozess |

---

## 🛠️ Erstes Setup (nur einmal nötig)

### Automatisches Setup:
1. Drücke **Ctrl+Shift+P**
2. Tippe: `Run Task`
3. Wähle: **🎯 Vollständiges Setup**
4. Fertig! ✅

### Manuelles Setup:
```powershell
# 1. Dependencies installieren
npm install

# 2. .env erstellen und API-Key eintragen
Copy-Item .env.example .env
# Bearbeite .env und füge deinen Groq API-Key ein
```

---

## 🚀 Typischer Workflow

1. **Projekt öffnen** in VS Code
2. **F5 drücken** → Client startet
3. Im integrierten Terminal arbeiten
4. Bei Änderungen: **Shift+F5** zum Stoppen, dann **F5** zum Neustart
5. Oder: **Dev Modus** für Auto-Reload nutzen!

---

## 💡 Tipps

- **NPM Scripts Explorer** ist aktiviert - siehe Sidebar für alle Scripts
- **Auto-Save** ist aktiviert - Änderungen werden automatisch gespeichert
- **Format on Save** ist aktiviert - Code wird automatisch formatiert
- **Integriertes Terminal** öffnet sich automatisch beim Start

---

## 🐛 Debugging

- Setze Breakpoints durch Klick links neben die Zeilennummer
- Debug-Console zeigt alle Ausgaben
- Variables-Panel zeigt alle Variablen
- Call Stack zeigt die Ausführungsreihenfolge

---

## ❓ Probleme?

**"Dependencies fehlen"**
→ Führe Task "📦 Dependencies installieren" aus

**"API-Key nicht gefunden"**
→ Führe Task "📝 .env Datei erstellen" aus und trage deinen Key ein

**"Kann nicht starten"**
→ Öffne das integrierte Terminal (**Ctrl+ö**) und prüfe Fehlermeldungen

---

**Viel Erfolg! 🎉**
