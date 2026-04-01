import { chromium, firefox, webkit } from 'playwright';
import fs from 'fs';
import logger from '../utils/logger.js';
import dataStore from '../utils/dataStore.js';
import config from '../utils/config.js';
import ActionHandler from '../actions/actionHandler.js';

/**
 * RuleEngine - Core automation engine that executes rules from JSON files
 */
class RuleEngine {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.actionHandler = null;
  }

  /**
   * Load rules from a JSON file
   * @param {string} ruleFilePath - Path to the rule file
   * @returns {Object} Parsed rule configuration
   */
  loadRules(ruleFilePath) {
    try {
      if (!fs.existsSync(ruleFilePath)) {
        throw new Error(`Rule file not found: ${ruleFilePath}`);
      }

      const fileContent = fs.readFileSync(ruleFilePath, 'utf-8');
      const rules = JSON.parse(fileContent);

      // Validate rule structure
      this.validateRules(rules);

      logger.info(`Loaded rules from: ${ruleFilePath}`);
      return rules;
    } catch (error) {
      logger.error(`Failed to load rules: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate the structure of the rule file
   * @param {Object} rules - The rule configuration
   */
  validateRules(rules) {
    if (!rules.name) {
      throw new Error('Rule file must have a "name" field');
    }

    if (!rules.steps || !Array.isArray(rules.steps)) {
      throw new Error('Rule file must have a "steps" array');
    }

    rules.steps.forEach((step, index) => {
      if (!step.stepId) {
        throw new Error(`Step at index ${index} is missing "stepId"`);
      }
      if (!step.action) {
        throw new Error(`Step ${step.stepId} is missing "action"`);
      }
      // enabled field is optional - defaults to true in ActionHandler
    });
  }

  /**
   * Initialize the browser
   */
  async initBrowser() {
    try {
      logger.info(`Launching ${config.browser.type} browser...`);

      // Select browser based on configuration
      let browserType;
      switch (config.browser.type.toLowerCase()) {
        case 'firefox':
          browserType = firefox;
          break;
        case 'webkit':
          browserType = webkit;
          break;
        case 'chromium':
        default:
          browserType = chromium;
      }

      this.browser = await browserType.launch({
        headless: config.browser.headless,
        channel: 'chrome',  // Use installed Google Chrome
        args: ['--start-maximized']
      });

      const contextOptions = config.browser.useWindowViewport
        ? { viewport: null }
        : { viewport: config.browser.viewport };
      this.context = await this.browser.newContext(contextOptions);

      this.page = await this.context.newPage();
      
      // Set default timeout
      this.page.setDefaultTimeout(config.timeouts.default);

      this.actionHandler = new ActionHandler(this.page, this.context);

      logger.info('Browser initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize browser: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute all steps in the rule file
   * @param {Object} rules - The rule configuration
   * @returns {Object} Execution summary
   */
  async executeRules(rules) {
    logger.info(`Starting execution of rule set: ${rules.name}`);
    
    // Check if network activity monitoring is enabled
    if (rules.networkActivity === true) {
      logger.info(`🔍 Network activity monitoring enabled - will track API calls`);
      this.actionHandler.enableNetworkMonitoring();
    } else {
      logger.info(`📴 Network activity monitoring disabled`);
      this.actionHandler.disableNetworkMonitoring();
    }
    
    const summary = {
      name: rules.name,
      description: rules.description || 'N/A',
      totalSteps: rules.steps.length,
      executed: 0,
      skipped: 0,
      failed: 0,
      results: []
    };

    for (const step of rules.steps) {
      // Default enabled to true if not specified
      const enabled = step.enabled !== undefined ? step.enabled : true;
      
      if (!enabled) {
        summary.skipped++;
        summary.results.push({
          stepId: step.stepId,
          action: step.action,
          status: 'skipped'
        });
        continue;
      }

      const result = await this.actionHandler.execute(step);

      if (result.success) {
        summary.executed++;
        summary.results.push({
          stepId: step.stepId,
          action: step.action,
          status: 'success',
          data: result.data
        });
      } else {
        summary.failed++;
        summary.results.push({
          stepId: step.stepId,
          action: step.action,
          status: 'failed',
          error: result.error
        });

        // Stop execution on failure if continueOnError is not set
        if (!step.continueOnError && !rules.continueOnError) {
          logger.error(`Stopping execution due to failure in step ${step.stepId}`);
          break;
        }
      }

      // Optional delay between steps
      if (step.delayAfter) {
        await this.page.waitForTimeout(step.delayAfter);
      }
    }

    return summary;
  }

  /**
   * Close the browser
   */
  async closeBrowser() {
    try {
      if (this.browser) {
        await this.browser.close();
        logger.info('Browser closed');
      }
    } catch (error) {
      logger.error(`Error closing browser: ${error.message}`);
    }
  }

  /**
   * Run the automation with the given rule file
   * @param {string} ruleFilePath - Path to the rule file
   */
  async run(ruleFilePath) {
    const startTime = Date.now();
    
    try {
      // Clear data store for new run
      dataStore.clear();
      
      // Load rules
      const rules = this.loadRules(ruleFilePath);
      
      // Initialize browser
      await this.initBrowser();
      
      // Execute rules
      const summary = await this.executeRules(rules);
      
      // Calculate execution time
      const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);
      summary.executionTime = `${executionTime}s`;
      
      // Log summary
      this.logSummary(summary);
      
      // Get stored data
      const storedData = dataStore.getAll();
      if (Object.keys(storedData).length > 0) {
        logger.info('Extracted Data:');
        logger.info(JSON.stringify(storedData, null, 2));
        summary.extractedData = storedData;
      }
      
      return summary;
    } catch (error) {
      logger.error(`Automation run failed: ${error.message}`);
      throw error;
    } finally {
      // Always close browser
      await this.closeBrowser();
    }
  }

  /**
   * Log the execution summary
   * @param {Object} summary - Execution summary
   */
  logSummary(summary) {
    logger.info('='.repeat(80));
    logger.info('EXECUTION SUMMARY');
    logger.info('='.repeat(80));
    logger.info(`Rule Set: ${summary.name}`);
    logger.info(`Description: ${summary.description}`);
    logger.info(`Total Steps: ${summary.totalSteps}`);
    logger.info(`Executed: ${summary.executed}`);
    logger.info(`Skipped: ${summary.skipped}`);
    logger.info(`Failed: ${summary.failed}`);
    logger.info(`Execution Time: ${summary.executionTime}`);
    logger.info('='.repeat(80));
  }
}

export default RuleEngine;

