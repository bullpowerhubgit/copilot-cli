#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { startInteractiveMode } from './interactive.js';
import { showBanner } from './banner.js';

program
  .name('copilot-client')
  .description('Kostenloser AI-gestützter CLI-Assistent')
  .version('1.0.0')
  .option('-b, --banner', 'Zeige das Banner')
  .option('-m, --model <model>', 'Wähle das AI-Modell')
  .action(async (options) => {
    if (options.banner) {
      showBanner();
    }

    console.log(
      boxen(
        chalk.cyan.bold('🤖 Copilot CLI Client') +
        '\n\n' +
        chalk.white('Kostenloser AI-Assistent für die Kommandozeile') +
        '\n' +
        chalk.gray('Tippe /help für Hilfe oder /exit zum Beenden'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'cyan'
        }
      )
    );

    await startInteractiveMode(options.model);
  });

program.parse();
