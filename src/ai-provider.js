import fetch from 'node-fetch';
import { loadConfig } from './config.js';

/**
 * AIProvider class - Manages interactions with multiple AI providers
 * Supports: Groq, OpenRouter, Hugging Face, Google Gemini, and Ollama
 */
export class AIProvider {
  /**
   * Creates an AIProvider instance
   * @param {string} modelName - The model to use (e.g., 'groq-llama-70b')
   */
  constructor(modelName) {
    this.modelName = modelName || 'groq-llama';
    this.config = loadConfig();
  }

  /**
   * Returns a list of all available AI models across all providers
   * @returns {Array<{name: string, value: string}>} Array of model objects
   */
  getAvailableModels() {
    return [
      { name: '⚡ Groq Llama 3.1 70B (Schnell & Kostenlos)', value: 'groq-llama-70b' },
      { name: '⚡ Groq Llama 3.3 70B (Neueste Version)', value: 'groq-llama-33' },
      { name: '⚡ Groq Mixtral 8x7B (Kostenlos)', value: 'groq-mixtral' },
      { name: '⚡ Groq Gemma 2 9B (Schnell)', value: 'groq-gemma' },
      { name: '🌐 OpenRouter GPT-3.5 Turbo (Credits)', value: 'openrouter-gpt35' },
      { name: '🌐 OpenRouter Claude 3 Haiku (Credits)', value: 'openrouter-claude-haiku' },
      { name: '🌐 OpenRouter Mistral 7B (Kostenlos)', value: 'openrouter-mistral' },
      { name: '🌐 OpenRouter Llama 3.1 8B (Kostenlos)', value: 'openrouter-llama' },
      { name: '🤗 Hugging Face Llama 2 (Kostenlos)', value: 'huggingface-llama' },
      { name: '🤗 Hugging Face Mistral 7B (Kostenlos)', value: 'huggingface-mistral' },
      { name: '🤗 Hugging Face Zephyr (Kostenlos)', value: 'huggingface-zephyr' },
      { name: '💎 Google Gemini 1.5 Flash (Kostenlos)', value: 'google-gemini-flash' },
      { name: '💎 Google Gemini 1.5 Pro (Kostenlos)', value: 'google-gemini-pro' },
      { name: '🏠 Ollama Llama 3.1 (Lokal)', value: 'ollama-llama' },
      { name: '🏠 Ollama Mistral (Lokal)', value: 'ollama-mistral' },
      { name: '🏠 Ollama CodeLlama (Lokal)', value: 'ollama-codellama' },
      { name: '🏠 Ollama Gemma 2 (Lokal)', value: 'ollama-gemma' }
    ];
  }

  /**
   * Sets the current AI model
   * @param {string} modelName - The model identifier to switch to
   */
  setModel(modelName) {
    this.modelName = modelName;
  }

  /**
   * Determines the provider name based on the current model
   * @returns {string} The provider name (e.g., 'Groq', 'OpenRouter')
   */
  getProviderName() {
    if (this.modelName.startsWith('groq-')) return 'Groq';
    if (this.modelName.startsWith('openrouter-')) return 'OpenRouter';
    if (this.modelName.startsWith('huggingface-')) return 'Hugging Face';
    if (this.modelName.startsWith('google-')) return 'Google Gemini';
    if (this.modelName.startsWith('ollama-')) return 'Ollama (Local)';
    return 'Unbekannt';
  }

  /**
   * Sends a message to the appropriate AI provider based on the current model
   * @param {Array<{role: string, content: string}>} conversationHistory - Chat history
   * @returns {Promise<string>} The AI's response
   * @throws {Error} If the provider is unknown or if the API call fails
   */
  async sendMessage(conversationHistory) {
    // Validate input
    if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
      throw new Error('Conversation history must be a non-empty array');
    }

    const provider = this.getProviderName();
    
    switch (provider) {
      case 'Groq':
        return await this.sendToGroq(conversationHistory);
      case 'OpenRouter':
        return await this.sendToOpenRouter(conversationHistory);
      case 'Hugging Face':
        return await this.sendToHuggingFace(conversationHistory);
      case 'Google Gemini':
        return await this.sendToGoogleGemini(conversationHistory);
      case 'Ollama (Local)':
        return await this.sendToOllama(conversationHistory);
      default:
        throw new Error('Unbekannter Provider');
    }
  }

  /**
   * Sends a message to the Groq API
   * @param {Array<{role: string, content: string}>} conversationHistory - Chat history
   * @returns {Promise<string>} The AI's response from Groq
   * @throws {Error} If API key is missing or if the API call fails
   */
  async sendToGroq(conversationHistory) {
    const apiKey = this.config.groqApiKey;
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error(
        'Groq API-Key nicht konfiguriert!\n' +
        'Erstelle einen kostenlosen Key auf https://console.groq.com\n' +
        'Und füge ihn zur .env Datei hinzu: GROQ_API_KEY=dein_key'
      );
    }

    const modelMap = {
      'groq-llama-70b': 'llama-3.1-70b-versatile',
      'groq-llama-33': 'llama-3.3-70b-versatile',
      'groq-mixtral': 'mixtral-8x7b-32768',
      'groq-gemma': 'gemma2-9b-it'
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelMap[this.modelName] || modelMap['groq-llama-70b'],
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API Fehler: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Sends a message to the OpenRouter API
   * @param {Array<{role: string, content: string}>} conversationHistory - Chat history
   * @returns {Promise<string>} The AI's response from OpenRouter
   * @throws {Error} If API key is missing or if the API call fails
   */
  async sendToOpenRouter(conversationHistory) {
    const apiKey = this.config.openrouterApiKey;
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error(
        'OpenRouter API-Key nicht konfiguriert!\n' +
        'Erstelle einen kostenlosen Key auf https://openrouter.ai\n' +
        'Und füge ihn zur .env Datei hinzu: OPENROUTER_API_KEY=dein_key'
      );
    }

    const modelMap = {
      'openrouter-gpt35': 'openai/gpt-3.5-turbo',
      'openrouter-claude-haiku': 'anthropic/claude-3-haiku',
      'openrouter-mistral': 'mistralai/mistral-7b-instruct',
      'openrouter-llama': 'meta-llama/llama-3.1-8b-instruct:free'
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/copilot-cli',
        'X-Title': 'Copilot CLI Client'
      },
      body: JSON.stringify({
        model: modelMap[this.modelName] || modelMap['openrouter-mistral'],
        messages: conversationHistory
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API Fehler: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Sends a message to the Hugging Face Inference API
   * @param {Array<{role: string, content: string}>} conversationHistory - Chat history
   * @returns {Promise<string>} The AI's response from Hugging Face
   * @throws {Error} If API key is missing or if the API call fails
   */
  async sendToHuggingFace(conversationHistory) {
    const apiKey = this.config.huggingfaceApiKey;
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error(
        'Hugging Face API-Key nicht konfiguriert!\n' +
        'Erstelle einen kostenlosen Key auf https://huggingface.co/settings/tokens\n' +
        'Und füge ihn zur .env Datei hinzu: HUGGINGFACE_API_KEY=dein_key'
      );
    }

    const modelMap = {
      'huggingface-llama': 'meta-llama/Llama-2-7b-chat-hf',
      'huggingface-mistral': 'mistralai/Mistral-7B-Instruct-v0.2',
      'huggingface-zephyr': 'HuggingFaceH4/zephyr-7b-beta'
    };

    const lastMessage = conversationHistory[conversationHistory.length - 1];
    
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${modelMap[this.modelName] || modelMap['huggingface-mistral']}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: lastMessage.content,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            return_full_text: false
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Hugging Face API Fehler: ${error}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || data.generated_text || 'Keine Antwort erhalten';
  }

  /**
   * Sends a message to the Google Gemini API
   * @param {Array<{role: string, content: string}>} conversationHistory - Chat history
   * @returns {Promise<string>} The AI's response from Google Gemini
   * @throws {Error} If API key is missing or if the API call fails
   */
  async sendToGoogleGemini(conversationHistory) {
    const apiKey = this.config.googleApiKey;
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error(
        'Google API-Key nicht konfiguriert!\n' +
        'Erstelle einen kostenlosen Key auf https://makersuite.google.com/app/apikey\n' +
        'Und füge ihn zur .env Datei hinzu: GOOGLE_API_KEY=dein_key'
      );
    }

    const modelMap = {
      'google-gemini-flash': 'gemini-1.5-flash',
      'google-gemini-pro': 'gemini-1.5-pro'
    };

    const model = modelMap[this.modelName] || modelMap['google-gemini-flash'];
    
    // Konvertiere Chat-Historie zu Gemini-Format
    const contents = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Gemini API Fehler: ${error}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'Keine Antwort erhalten';
  }

  /**
   * Sends a message to a local Ollama instance
   * @param {Array<{role: string, content: string}>} conversationHistory - Chat history
   * @returns {Promise<string>} The AI's response from Ollama
   * @throws {Error} If Ollama is not running or if the API call fails
   */
  async sendToOllama(conversationHistory) {
    const ollamaHost = this.config.ollamaHost || 'http://localhost:11434';

    const modelMap = {
      'ollama-llama': 'llama3.1',
      'ollama-mistral': 'mistral',
      'ollama-codellama': 'codellama',
      'ollama-gemma': 'gemma2'
    };

    const model = modelMap[this.modelName] || modelMap['ollama-llama'];

    try {
      const response = await fetch(`${ollamaHost}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: conversationHistory,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama ist nicht erreichbar. Stelle sicher, dass Ollama läuft: ollama serve`);
      }

      const data = await response.json();
      return data.message?.content || 'Keine Antwort erhalten';
    } catch (error) {
      throw new Error(
        `Ollama Fehler: ${error.message}\n\n` +
        'Installiere Ollama von https://ollama.ai\n' +
        `Führe dann aus: ollama pull ${model}\n` +
        'Und starte Ollama: ollama serve'
      );
    }
  }
}
