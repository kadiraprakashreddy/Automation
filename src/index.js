#!/usr/bin/env node

import RuleEngine from './engine/ruleEngine.js';
import logger from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main entry point for the Playwright Automation Engine
 */
async function main() {
  try {
    // Get rule file path from command line arguments
    const ruleFilePath = process.argv[2];

    if (!ruleFilePath) {
      console.error('Usage: node src/index.js <path-to-rule-file.json>');
      console.error('Example: node src/index.js rules/example-login.json');
      process.exit(1);
    }

    // Resolve absolute path
    const absolutePath = path.isAbsolute(ruleFilePath) 
      ? ruleFilePath 
      : path.resolve(process.cwd(), ruleFilePath);

    logger.info('╔════════════════════════════════════════════════════════════════╗');
    logger.info('║     PLAYWRIGHT AUTOMATION ENGINE - RULE-BASED EXECUTION       ║');
    logger.info('╚════════════════════════════════════════════════════════════════╝');
    logger.info('');

    // Create and run the automation engine
    const engine = new RuleEngine();
    const summary = await engine.run(absolutePath);

    // Exit with appropriate code
    if (summary.failed > 0) {
      logger.error('Automation completed with errors');
      process.exit(1);
    } else {
      logger.info('Automation completed successfully');
      process.exit(0);
    }
  } catch (error) {
    logger.error(`Fatal error: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
}

// Run the main function
main();

