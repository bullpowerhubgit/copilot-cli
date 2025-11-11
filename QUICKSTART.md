# 🚀 Quick Start Guide

## Die 3 schnellsten Wege zu starten:

### 1️⃣ Groq (Empfohlen - 2 Minuten Setup)

```powershell
# Dependencies installieren
npm install

# .env Datei erstellen
Copy-Item .env.example .env

# Gehe zu https://console.groq.com
# Erstelle Account → API Keys → Create API Key
# Füge Key in .env ein: GROQ_API_KEY=gsk_...

# Starten!
npm start
```

### 2️⃣ Google Gemini (Sehr großzügig)

```powershell
npm install
Copy-Item .env.example .env

# Gehe zu https://makersuite.google.com/app/apikey
# Mit Google-Konto anmelden → Get API Key
# In .env einfügen: GOOGLE_API_KEY=AIza...

npm start
# Dann /model wählen und "Google Gemini Flash" auswählen
```

### 3️⃣ Ollama (100% Lokal & Privat)

```powershell
# Ollama installieren von https://ollama.ai
# Dann:
ollama pull llama3.1
ollama serve

# In einem neuen Terminal:
cd copilot-cli
npm install
npm start
# Dann /model wählen und "Ollama Llama 3.1" auswählen
```

## Vergleich der Optionen:

| Provider | Geschwindigkeit | Kosten | Internet nötig? | Setup-Zeit |
|----------|----------------|--------|-----------------|------------|
| **Groq** | ⚡⚡⚡ Sehr schnell | 100% kostenlos | Ja | 2 min |
| **Google Gemini** | ⚡⚡ Schnell | 100% kostenlos | Ja | 2 min |
| **Ollama** | ⚡ Mittel | 100% kostenlos | Nein! | 5 min |
| OpenRouter | ⚡⚡ Schnell | Credits (später kostenpflichtig) | Ja | 3 min |
| Hugging Face | ⚡ Langsamer | 100% kostenlos | Ja | 3 min |

**Tipp:** Starte mit Groq für die beste Erfahrung! 🚀
