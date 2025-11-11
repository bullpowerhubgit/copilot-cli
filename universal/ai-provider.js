const fetch = require('node-fetch');

class AIProvider {
  constructor(modelName, config = {}) {
    this.modelName = modelName || 'groq-llama-70b';
    this.config = config;
  }

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

  getProviderName() {
    if (this.modelName.startsWith('groq-')) return 'Groq';
    if (this.modelName.startsWith('openrouter-')) return 'OpenRouter';
    if (this.modelName.startsWith('huggingface-')) return 'Hugging Face';
    if (this.modelName.startsWith('google-')) return 'Google Gemini';
    if (this.modelName.startsWith('ollama-')) return 'Ollama (Local)';
    return 'Unbekannt';
  }

  async sendMessage(conversationHistory) {
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

  async sendToGroq(conversationHistory) {
    const apiKey = this.config.groqApiKey;

    if (!apiKey) {
      throw new Error('Groq API-Key nicht konfiguriert! Bitte in den Einstellungen hinzufügen.');
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

  async sendToGoogleGemini(conversationHistory) {
    const apiKey = this.config.googleApiKey;

    if (!apiKey) {
      throw new Error('Google API-Key nicht konfiguriert! Bitte in den Einstellungen hinzufügen.');
    }

    const modelMap = {
      'google-gemini-flash': 'gemini-1.5-flash',
      'google-gemini-pro': 'gemini-1.5-pro'
    };

    const model = modelMap[this.modelName] || modelMap['google-gemini-flash'];

    const contents = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: conversationHistory,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama ist nicht erreichbar.`);
      }

      const data = await response.json();
      return data.message?.content || 'Keine Antwort erhalten';
    } catch (error) {
      throw new Error(`Ollama Fehler: ${error.message}. Stelle sicher, dass Ollama läuft!`);
    }
  }

  async sendToOpenRouter(conversationHistory) {
    const apiKey = this.config.openrouterApiKey;
    if (!apiKey) throw new Error('OpenRouter API-Key nicht konfiguriert!');

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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelMap[this.modelName] || modelMap['openrouter-mistral'],
        messages: conversationHistory
      })
    });

    if (!response.ok) throw new Error(`OpenRouter API Fehler`);
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async sendToHuggingFace(conversationHistory) {
    const apiKey = this.config.huggingfaceApiKey;
    if (!apiKey) throw new Error('Hugging Face API-Key nicht konfiguriert!');

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
          parameters: { max_new_tokens: 500, temperature: 0.7, return_full_text: false }
        })
      }
    );

    if (!response.ok) throw new Error(`Hugging Face API Fehler`);
    const data = await response.json();
    return data[0]?.generated_text || data.generated_text || 'Keine Antwort';
  }
}

module.exports = AIProvider;
