import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lade Umgebungsvariablen
dotenv.config();

/** Configuration directory path */
const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.copilot-cli');

/** Configuration file path */
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Default configuration object
 * @typedef {Object} Config
 * @property {string} defaultModel - Default AI model to use
 * @property {string} groqApiKey - Groq API key
 * @property {string} openrouterApiKey - OpenRouter API key
 * @property {string} huggingfaceApiKey - Hugging Face API key
 * @property {string} googleApiKey - Google API key
 * @property {string} ollamaHost - Ollama host URL
 */
const DEFAULT_CONFIG = {
  defaultModel: 'groq-llama-70b',
  groqApiKey: process.env.GROQ_API_KEY || '',
  openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434'
};

/**
 * Loads configuration from file or creates default config
 * @returns {Config} The loaded or default configuration
 */
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

/**
 * Saves configuration to file
 * @param {Config} config - Configuration object to save
 */
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

/**
 * Returns the path to the configuration file
 * @returns {string} The configuration file path
 */
export function getConfigPath() {
  return CONFIG_FILE;
}
