#!/usr/bin/env node

/**
 * Smoke test to verify all core functionality works
 * Tests that don't require actual API keys
 */

import { AIProvider } from '../src/ai-provider.js';
import { loadConfig } from '../src/config.js';
import chalk from 'chalk';

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(chalk.green('✓'), name);
    testsPassed++;
  } catch (error) {
    console.log(chalk.red('✗'), name);
    console.log(chalk.red('  Error:'), error.message);
    testsFailed++;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(chalk.green('✓'), name);
    testsPassed++;
  } catch (error) {
    console.log(chalk.red('✗'), name);
    console.log(chalk.red('  Error:'), error.message);
    testsFailed++;
  }
}

console.log(chalk.bold('\n🧪 Running Smoke Tests\n'));

// Test 1: Config module
test('Config module loads', () => {
  const config = loadConfig();
  if (!config) throw new Error('Config is null');
  if (typeof config !== 'object') throw new Error('Config is not an object');
});

test('Config has required keys', () => {
  const config = loadConfig();
  const requiredKeys = ['defaultModel', 'groqApiKey', 'openrouterApiKey', 'huggingfaceApiKey', 'googleApiKey', 'ollamaHost'];
  for (const key of requiredKeys) {
    if (!(key in config)) throw new Error('Missing config key: ' + key);
  }
});

// Test 2: AI Provider instantiation
test('AIProvider can be instantiated', () => {
  const provider = new AIProvider();
  if (!provider) throw new Error('Provider is null');
});

test('AIProvider getAvailableModels returns array', () => {
  const provider = new AIProvider();
  const models = provider.getAvailableModels();
  if (!Array.isArray(models)) throw new Error('Models is not an array');
  if (models.length === 0) throw new Error('No models available');
});

test('AIProvider getAvailableModels returns 17 models', () => {
  const provider = new AIProvider();
  const models = provider.getAvailableModels();
  if (models.length !== 17) throw new Error('Expected 17 models, got ' + models.length);
});

test('AIProvider setModel works', () => {
  const provider = new AIProvider();
  provider.setModel('groq-llama-70b');
  if (provider.modelName !== 'groq-llama-70b') throw new Error('Model not set correctly');
});

test('AIProvider getProviderName returns correct provider for Groq', () => {
  const provider = new AIProvider('groq-llama-70b');
  const providerName = provider.getProviderName();
  if (providerName !== 'Groq') throw new Error('Expected Groq, got ' + providerName);
});

test('AIProvider getProviderName returns correct provider for OpenRouter', () => {
  const provider = new AIProvider('openrouter-gpt35');
  const providerName = provider.getProviderName();
  if (providerName !== 'OpenRouter') throw new Error('Expected OpenRouter, got ' + providerName);
});

test('AIProvider getProviderName returns correct provider for Hugging Face', () => {
  const provider = new AIProvider('huggingface-llama');
  const providerName = provider.getProviderName();
  if (providerName !== 'Hugging Face') throw new Error('Expected Hugging Face, got ' + providerName);
});

test('AIProvider getProviderName returns correct provider for Google', () => {
  const provider = new AIProvider('google-gemini-flash');
  const providerName = provider.getProviderName();
  if (providerName !== 'Google Gemini') throw new Error('Expected Google Gemini, got ' + providerName);
});

test('AIProvider getProviderName returns correct provider for Ollama', () => {
  const provider = new AIProvider('ollama-llama');
  const providerName = provider.getProviderName();
  if (providerName !== 'Ollama (Local)') throw new Error('Expected Ollama (Local), got ' + providerName);
});

// Test 3: Error handling for missing API keys
await asyncTest('sendToGroq throws error without API key', async () => {
  const provider = new AIProvider('groq-llama-70b');
  try {
    await provider.sendMessage([{ role: 'user', content: 'test' }]);
    throw new Error('Should have thrown error');
  } catch (error) {
    if (!error.message.includes('API-Key')) {
      throw new Error('Expected API key error, got: ' + error.message);
    }
  }
});

await asyncTest('sendToOpenRouter throws error without API key', async () => {
  const provider = new AIProvider('openrouter-gpt35');
  try {
    await provider.sendMessage([{ role: 'user', content: 'test' }]);
    throw new Error('Should have thrown error');
  } catch (error) {
    if (!error.message.includes('API-Key')) {
      throw new Error('Expected API key error, got: ' + error.message);
    }
  }
});

await asyncTest('sendToHuggingFace throws error without API key', async () => {
  const provider = new AIProvider('huggingface-llama');
  try {
    await provider.sendMessage([{ role: 'user', content: 'test' }]);
    throw new Error('Should have thrown error');
  } catch (error) {
    if (!error.message.includes('API-Key')) {
      throw new Error('Expected API key error, got: ' + error.message);
    }
  }
});

await asyncTest('sendToGoogleGemini throws error without API key', async () => {
  const provider = new AIProvider('google-gemini-flash');
  try {
    await provider.sendMessage([{ role: 'user', content: 'test' }]);
    throw new Error('Should have thrown error');
  } catch (error) {
    if (!error.message.includes('API-Key')) {
      throw new Error('Expected API key error, got: ' + error.message);
    }
  }
});

// Test 4: All provider methods exist
test('sendToGroq method exists', () => {
  const provider = new AIProvider();
  if (typeof provider.sendToGroq !== 'function') throw new Error('sendToGroq is not a function');
});

test('sendToOpenRouter method exists', () => {
  const provider = new AIProvider();
  if (typeof provider.sendToOpenRouter !== 'function') throw new Error('sendToOpenRouter is not a function');
});

test('sendToHuggingFace method exists', () => {
  const provider = new AIProvider();
  if (typeof provider.sendToHuggingFace !== 'function') throw new Error('sendToHuggingFace is not a function');
});

test('sendToGoogleGemini method exists', () => {
  const provider = new AIProvider();
  if (typeof provider.sendToGoogleGemini !== 'function') throw new Error('sendToGoogleGemini is not a function');
});

test('sendToOllama method exists', () => {
  const provider = new AIProvider();
  if (typeof provider.sendToOllama !== 'function') throw new Error('sendToOllama is not a function');
});

test('sendMessage method exists', () => {
  const provider = new AIProvider();
  if (typeof provider.sendMessage !== 'function') throw new Error('sendMessage is not a function');
});

// Summary
console.log(chalk.bold('\n📊 Test Results\n'));
console.log(chalk.green('  Passed: ' + testsPassed));
console.log(chalk.red('  Failed: ' + testsFailed));
console.log(chalk.bold('  Total:  ' + (testsPassed + testsFailed) + '\n'));

if (testsFailed > 0) {
  console.log(chalk.red('❌ Some tests failed\n'));
  process.exit(1);
} else {
  console.log(chalk.green('✅ All tests passed!\n'));
  process.exit(0);
}
