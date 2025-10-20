import logger from '../utils/logger.js';
import dataStore from '../utils/dataStore.js';
import config from '../utils/config.js';
import fs from 'fs';
import path from 'path';

/**
 * ActionHandler - Handles all browser actions based on rule definitions
 */
class ActionHandler {
  constructor(page, context) {
    this.page = page;
    this.context = context;
  }

  /**
   * Execute an action based on the step configuration
   * @param {Object} step - The step configuration from the rule file
   * @returns {Promise<Object>} Result object with success status and data
   */
  async execute(step) {
    const { stepId, action, enabled } = step;

    if (!enabled) {
      logger.info(`Step ${stepId} is disabled, skipping...`);
      return { success: true, skipped: true };
    }

    logger.info(`Executing Step ${stepId}: ${action}`);

    try {
      let result;
      switch (action.toLowerCase()) {
        case 'navigate':
          result = await this.navigate(step);
          break;
        case 'click':
          result = await this.click(step);
          break;
        case 'type':
          result = await this.type(step);
          break;
        case 'wait':
          result = await this.wait(step);
          break;
        case 'waitfornavigation':
          result = await this.waitForNavigation(step);
          break;
        case 'waitforselector':
          result = await this.waitForSelector(step);
          break;
        case 'extracttext':
          result = await this.extractText(step);
          break;
        case 'extractattribute':
          result = await this.extractAttribute(step);
          break;
        case 'screenshot':
          result = await this.takeScreenshot(step);
          break;
        case 'select':
          result = await this.select(step);
          break;
        case 'hover':
          result = await this.hover(step);
          break;
        case 'check':
          result = await this.check(step);
          break;
        case 'uncheck':
          result = await this.uncheck(step);
          break;
        case 'evaluate':
          result = await this.evaluate(step);
          break;
        case 'fill':
          result = await this.fill(step);
          break;
        case 'validate':
          result = await this.validate(step);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      logger.info(`Step ${stepId} completed successfully`);
      return { success: true, data: result };
    } catch (error) {
      logger.error(`Step ${stepId} failed: ${error.message}`);
      
      // Capture screenshot on error if enabled
      if (config.screenshot.onError) {
        await this.captureErrorScreenshot(stepId);
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Navigate to a URL
   */
  async navigate(step) {
    const { url } = step;
    await this.page.goto(url, { 
      timeout: config.timeouts.navigation,
      waitUntil: step.waitUntil || 'domcontentloaded'
    });
    return { url };
  }

  /**
   * Click an element
   */
  async click(step) {
    const { selector } = step;
    await this.page.click(selector, {
      timeout: step.timeout || config.timeouts.default
    });
    return { selector };
  }

  /**
   * Type text into an input field
   */
  async type(step) {
    const { selector, text, delay } = step;
    
    // Replace placeholders with stored data
    const processedText = this.replacePlaceholders(text);
    
    await this.page.type(selector, processedText, {
      delay: delay || 0,
      timeout: step.timeout || config.timeouts.default
    });
    return { selector, text: processedText };
  }

  /**
   * Fill an input field (faster than type)
   */
  async fill(step) {
    const { selector, text } = step;
    
    // Replace placeholders with stored data
    const processedText = this.replacePlaceholders(text);
    
    await this.page.fill(selector, processedText, {
      timeout: step.timeout || config.timeouts.default
    });
    return { selector, text: processedText };
  }

  /**
   * Wait for a specified duration
   */
  async wait(step) {
    const { duration } = step;
    await this.page.waitForTimeout(duration);
    return { duration };
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(step) {
    await this.page.waitForLoadState(step.waitUntil || 'networkidle', {
      timeout: step.timeout || config.timeouts.navigation
    });
    return { waitUntil: step.waitUntil || 'networkidle' };
  }

  /**
   * Wait for a selector to be visible
   */
  async waitForSelector(step) {
    const { selector, state } = step;
    await this.page.waitForSelector(selector, {
      state: state || 'visible',
      timeout: step.timeout || config.timeouts.default
    });
    return { selector, state: state || 'visible' };
  }

  /**
   * Extract text from an element
   */
  async extractText(step) {
    const { selector, storeAs } = step;
    const element = await this.page.$(selector);
    
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    
    const text = await element.textContent();
    
    if (storeAs) {
      dataStore.set(storeAs, text);
      logger.info(`Stored text as '${storeAs}': ${text}`);
    }
    
    return { selector, text, storeAs };
  }

  /**
   * Extract an attribute from an element
   */
  async extractAttribute(step) {
    const { selector, attribute, storeAs } = step;
    const element = await this.page.$(selector);
    
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    
    const value = await element.getAttribute(attribute);
    
    if (storeAs) {
      dataStore.set(storeAs, value);
      logger.info(`Stored attribute '${attribute}' as '${storeAs}': ${value}`);
    }
    
    return { selector, attribute, value, storeAs };
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(step) {
    const { filename, fullPage } = step;
    const screenshotDir = config.screenshot.path;
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const filepath = path.join(screenshotDir, filename);
    await this.page.screenshot({ 
      path: filepath, 
      fullPage: fullPage !== false 
    });
    
    logger.info(`Screenshot saved: ${filepath}`);
    return { filepath };
  }

  /**
   * Select an option from a dropdown
   */
  async select(step) {
    const { selector, value, label, index } = step;
    
    let result;
    if (value) {
      result = await this.page.selectOption(selector, { value });
    } else if (label) {
      result = await this.page.selectOption(selector, { label });
    } else if (index !== undefined) {
      result = await this.page.selectOption(selector, { index });
    } else {
      throw new Error('Select action requires value, label, or index');
    }
    
    return { selector, selected: result };
  }

  /**
   * Hover over an element
   */
  async hover(step) {
    const { selector } = step;
    await this.page.hover(selector, {
      timeout: step.timeout || config.timeouts.default
    });
    return { selector };
  }

  /**
   * Check a checkbox or radio button
   */
  async check(step) {
    const { selector } = step;
    await this.page.check(selector, {
      timeout: step.timeout || config.timeouts.default
    });
    return { selector };
  }

  /**
   * Uncheck a checkbox
   */
  async uncheck(step) {
    const { selector } = step;
    await this.page.uncheck(selector, {
      timeout: step.timeout || config.timeouts.default
    });
    return { selector };
  }

  /**
   * Execute custom JavaScript code
   */
  async evaluate(step) {
    const { script, storeAs } = step;
    const result = await this.page.evaluate(script);
    
    if (storeAs) {
      dataStore.set(storeAs, result);
      logger.info(`Stored evaluation result as '${storeAs}'`);
    }
    
    return { result, storeAs };
  }

  /**
   * Validate elements and data on the page
   * Supports multiple validation types and notification methods
   */
  async validate(step) {
    const { 
      validationType, 
      selector, 
      expectedValue, 
      attribute,
      onFailure = 'console',
      failureMessage,
      continueOnFailure = false,
      storeAs
    } = step;

    let actualValue;
    let validationPassed = false;
    let validationResult = {};

    try {
      switch (validationType.toLowerCase()) {
        case 'textequals':
          actualValue = await this.page.textContent(selector);
          validationPassed = actualValue === expectedValue;
          validationResult = { selector, expectedValue, actualValue, validationPassed };
          break;

        case 'textcontains':
          actualValue = await this.page.textContent(selector);
          validationPassed = actualValue && actualValue.includes(expectedValue);
          validationResult = { selector, expectedValue, actualValue, validationPassed };
          break;

        case 'attributeequals':
          if (!attribute) {
            throw new Error('Attribute name is required for attributeEquals validation');
          }
          const element = await this.page.$(selector);
          if (!element) {
            throw new Error(`Element not found: ${selector}`);
          }
          actualValue = await element.getAttribute(attribute);
          validationPassed = actualValue === expectedValue;
          validationResult = { selector, attribute, expectedValue, actualValue, validationPassed };
          break;

        case 'exists':
          const elementExists = await this.page.$(selector);
          validationPassed = !!elementExists;
          actualValue = validationPassed ? 'Element exists' : 'Element not found';
          validationResult = { selector, validationPassed, actualValue };
          break;

        case 'notexists':
          const elementNotExists = await this.page.$(selector);
          validationPassed = !elementNotExists;
          actualValue = !validationPassed ? 'Element exists' : 'Element not found';
          validationResult = { selector, validationPassed, actualValue };
          break;

        case 'visible':
          const isVisible = await this.page.isVisible(selector);
          validationPassed = isVisible;
          actualValue = validationPassed ? 'Element visible' : 'Element not visible';
          validationResult = { selector, validationPassed, actualValue };
          break;

        case 'count':
          const elements = await this.page.$$(selector);
          const count = elements.length;
          validationPassed = count === parseInt(expectedValue);
          actualValue = count;
          validationResult = { selector, expectedValue, actualValue, validationPassed };
          break;

        default:
          throw new Error(`Unknown validation type: ${validationType}`);
      }

      // Store validation result if requested
      if (storeAs) {
        dataStore.set(storeAs, validationPassed);
        logger.info(`Stored validation result as '${storeAs}': ${validationPassed}`);
      }

      // Handle validation failure
      if (!validationPassed) {
        const message = failureMessage || `Validation failed: Expected ${expectedValue}, but got ${actualValue}`;
        logger.warn(`VALIDATION FAILED: ${message}`);
        
        // Show notification based on onFailure setting
        await this.showValidationNotification(onFailure, message, false);

        // Throw error if continueOnFailure is false
        if (!continueOnFailure) {
          throw new Error(message);
        }
      } else {
        logger.info(`VALIDATION PASSED: ${validationType} for ${selector}`);
      }

      return validationResult;

    } catch (error) {
      const message = failureMessage || error.message;
      logger.error(`Validation error: ${message}`);
      
      // Show notification
      await this.showValidationNotification(onFailure, message, false);
      
      if (!continueOnFailure) {
        throw error;
      }
      
      return { validationPassed: false, error: message };
    }
  }

  /**
   * Show validation notification in the browser
   */
  async showValidationNotification(notificationType, message, isSuccess) {
    const bgColor = isSuccess ? '#10b981' : '#ef4444';
    const icon = isSuccess ? '✓' : '✗';

    try {
      switch (notificationType.toLowerCase()) {
        case 'alert':
          await this.page.evaluate((msg) => alert(msg), message);
          break;

        case 'visual':
          await this.page.evaluate(({ msg, bg, icn }) => {
            const div = document.createElement('div');
            div.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: ${bg};
              color: white;
              padding: 16px 24px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              z-index: 99999;
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 14px;
              max-width: 400px;
              animation: slideIn 0.3s ease-out;
            `;
            div.innerHTML = `<strong style="font-size: 18px; margin-right: 8px;">${icn}</strong>${msg}`;
            
            const style = document.createElement('style');
            style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
            document.head.appendChild(style);
            
            document.body.appendChild(div);
            setTimeout(() => {
              div.style.animation = 'slideIn 0.3s ease-out reverse';
              setTimeout(() => div.remove(), 300);
            }, 5000);
          }, { msg: message, bg: bgColor, icn: icon });
          break;

        case 'console':
        default:
          // Just log to console (already logged above)
          break;
      }
    } catch (error) {
      logger.warn(`Failed to show notification: ${error.message}`);
    }
  }

  /**
   * Capture screenshot on error
   */
  async captureErrorScreenshot(stepId) {
    try {
      const screenshotDir = config.screenshot.path;
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filepath = path.join(screenshotDir, `error-step-${stepId}-${timestamp}.png`);
      await this.page.screenshot({ path: filepath, fullPage: true });
      
      logger.info(`Error screenshot saved: ${filepath}`);
    } catch (error) {
      logger.error(`Failed to capture error screenshot: ${error.message}`);
    }
  }

  /**
   * Replace placeholders in text with stored data
   * Format: {{key}}
   */
  replacePlaceholders(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }
    
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (dataStore.has(key)) {
        return dataStore.get(key);
      }
      logger.warn(`Placeholder '${key}' not found in data store`);
      return match;
    });
  }
}

export default ActionHandler;

