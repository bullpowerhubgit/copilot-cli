import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lade Umgebungsvariablen
dotenv.config();

const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.copilot-cli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG = {
  defaultModel: 'groq-llama-70b',
  groqApiKey: process.env.GROQ_API_KEY || '',
  openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434'
};

export function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    if (!fs.existsSync(CONFIG_FILE)) {
      saveConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }

    const configData = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(configData) };
  } catch (error) {
    console.error('Fehler beim Laden der Konfiguration:', error.message);
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Fehler beim Speichern der Konfiguration:', error.message);
  }
}

export function getConfigPath() {
  return CONFIG_FILE;
}
