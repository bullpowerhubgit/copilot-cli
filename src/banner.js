import chalk from 'chalk';

export function showBanner() {
  const banner = `
${chalk.cyan('    ╔═══════════════════════════════════════════╗')}
${chalk.cyan('    ║')}   ${chalk.bold.white('🤖  COPILOT CLI CLIENT  🤖')}          ${chalk.cyan('║')}
${chalk.cyan('    ╠═══════════════════════════════════════════╣')}
${chalk.cyan('    ║')}                                           ${chalk.cyan('║')}
${chalk.cyan('    ║')}   ${chalk.yellow('Dein kostenloser AI-Assistent')}       ${chalk.cyan('║')}
${chalk.cyan('    ║')}   ${chalk.green('für die Kommandozeile')}               ${chalk.cyan('║')}
${chalk.cyan('    ║')}                                           ${chalk.cyan('║')}
${chalk.cyan('    ╚═══════════════════════════════════════════╝')}
  `;

  console.log(banner);
  console.log(chalk.gray('    Powered by kostenlose AI-Modelle\n'));
}
