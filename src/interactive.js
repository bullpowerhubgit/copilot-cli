import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { AIProvider } from './ai-provider.js';
import { loadConfig, saveConfig } from './config.js';

/**
 * Available slash commands in interactive mode
 */
const COMMANDS = {
  '/help': 'Zeigt alle verfügbaren Befehle',
  '/model': 'Wähle ein anderes AI-Modell',
  '/config': 'Zeige aktuelle Konfiguration',
  '/clear': 'Lösche die Konversationshistorie',
  '/exit': 'Beende den Client',
  '/feedback': 'Gib Feedback'
};

/** @type {Array<{role: string, content: string}>} */
let conversationHistory = [];

/** @type {AIProvider|null} */
let aiProvider = null;

/**
 * Starts the interactive chat mode
 * @param {string} [modelName] - Optional model to start with
 * @returns {Promise<void>}
 */
export async function startInteractiveMode(modelName) {
  const config = loadConfig();

  // Initialisiere AI Provider
  aiProvider = new AIProvider(modelName || config.defaultModel);

  console.log(chalk.green('✓ Bereit! Stelle deine Frage oder verwende einen Befehl.\n'));

  while (true) {
    const { input } = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: chalk.cyan('Du:'),
        prefix: ''
      }
    ]);

    const trimmedInput = input.trim();

    if (!trimmedInput) continue;

    // Verarbeite Slash-Befehle
    if (trimmedInput.startsWith('/')) {
      const shouldExit = await handleCommand(trimmedInput);
      if (shouldExit) break;
      continue;
    }

    // Verarbeite normale Eingabe als AI-Anfrage
    await handleAIRequest(trimmedInput);
  }
}

/**
 * Handles slash commands entered by the user
 * @param {string} command - The command string (e.g., '/help')
 * @returns {Promise<boolean>} Returns true if the program should exit
 */
async function handleCommand(command) {
  const cmd = command.split(' ')[0].toLowerCase();

  switch (cmd) {
    case '/help':
      showHelp();
      break;

    case '/model':
      await selectModel();
      break;

    case '/config':
      showConfig();
      break;

    case '/clear':
      conversationHistory = [];
      console.log(chalk.green('✓ Konversationshistorie gelöscht\n'));
      break;

    case '/exit':
      console.log(chalk.yellow('\n👋 Auf Wiedersehen!\n'));
      return true;

    case '/feedback':
      console.log(chalk.cyan('\n📧 Feedback gerne per GitHub Issues!\n'));
      break;

    default:
      console.log(chalk.red(`❌ Unbekannter Befehl: ${cmd}`));
      console.log(chalk.gray('Tippe /help für alle Befehle\n'));
  }

  return false;
}

/**
 * Displays help information with all available commands
 */
function showHelp() {
  console.log(chalk.bold('\n📖 Verfügbare Befehle:\n'));

  for (const [cmd, desc] of Object.entries(COMMANDS)) {
    console.log(`  ${chalk.cyan(cmd.padEnd(15))} ${chalk.gray(desc)}`);
  }
  console.log();
}

/**
 * Prompts the user to select a different AI model
 * @returns {Promise<void>}
 */
async function selectModel() {
  const models = aiProvider.getAvailableModels();

  const { model } = await inquirer.prompt([
    {
      type: 'list',
      name: 'model',
      message: 'Wähle ein AI-Modell:',
      choices: models
    }
  ]);

  aiProvider.setModel(model);
  const config = loadConfig();
  config.defaultModel = model;
  saveConfig(config);

  console.log(chalk.green(`✓ Modell gewechselt zu: ${model}\n`));
}

/**
 * Displays the current configuration (model and provider)
 */
function showConfig() {
  const config = loadConfig();
  console.log(chalk.bold('\n⚙️  Aktuelle Konfiguration:\n'));
  console.log(chalk.cyan('  Modell:'), config.defaultModel || 'groq-llama-70b');
  console.log(chalk.cyan('  Provider:'), aiProvider.getProviderName());
  
  // Show which API keys are configured
  console.log(chalk.cyan('\n  Konfigurierte API-Keys:'));
  console.log(chalk.gray('    Groq:'), config.groqApiKey ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('    OpenRouter:'), config.openrouterApiKey ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('    Hugging Face:'), config.huggingfaceApiKey ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('    Google:'), config.googleApiKey ? chalk.green('✓') : chalk.red('✗'));
  console.log(chalk.gray('    Ollama:'), chalk.blue('(lokal)'));
  console.log();
}

/**
 * Handles an AI request from the user
 * Sends the message to the AI provider and displays the response
 * @param {string} userInput - The user's input message
 * @returns {Promise<void>}
 */
async function handleAIRequest(userInput) {
  // Validate input
  if (!userInput || userInput.trim() === '') {
    console.log(chalk.yellow('⚠️  Bitte gib eine Nachricht ein.\n'));
    return;
  }

  // Füge zur Historie hinzu
  conversationHistory.push({
    role: 'user',
    content: userInput
  });

  const spinner = ora('AI denkt nach...').start();

  try {
    const response = await aiProvider.sendMessage(conversationHistory);
    spinner.succeed('Antwort erhalten');

    // Validate response
    if (!response || response.trim() === '') {
      throw new Error('Leere Antwort vom AI-Provider erhalten');
    }

    conversationHistory.push({
      role: 'assistant',
      content: response
    });

    console.log(chalk.green('\nAssistent: ') + response + '\n');

  } catch (error) {
    spinner.fail('Fehler bei der AI-Anfrage');
    console.error(chalk.red(`\n❌ Fehler: ${error.message}\n`));

    // Entferne die fehlgeschlagene Nachricht
    conversationHistory.pop();
  }
}
