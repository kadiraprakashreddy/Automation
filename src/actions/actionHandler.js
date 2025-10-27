import logger from '../utils/logger.js';
import dataStore from '../utils/dataStore.js';
import config from '../utils/config.js';
import { validate, showBrowserAlert, showConsoleAlert } from '../utils/alertScripts.js';
import fs from 'fs';
import path from 'path';

/**
 * ActionHandler - Handles all browser actions based on rule definitions
 */
class ActionHandler {
  constructor(page, context) {
    this.page = page;
    this.context = context;
    this.networkRequests = [];
    this.networkResponses = [];
    this.setupNetworkMonitoring();
  }

  /**
   * Setup network monitoring to track requests and responses
   */
  setupNetworkMonitoring() {
    // Clear previous network data
    this.networkRequests = [];
    this.networkResponses = [];
    this.networkActivityEnabled = false; // Will be set by rule engine
  }

  /**
   * Enable network monitoring (called by rule engine)
   */
  enableNetworkMonitoring() {
    this.networkActivityEnabled = true;
    this.clearNetworkData();
    
    // Monitor network requests
    this.page.on('request', request => {
      if (!this.networkActivityEnabled) return;
      
      // Only track API calls (exclude static resources)
      const isApiCall = request.resourceType() === 'xhr' || 
                       request.resourceType() === 'fetch' ||
                       request.url().includes('/api/') ||
                       request.url().includes('/graphql') ||
                       request.url().includes('/rest/') ||
                       request.url().includes('/v1/') ||
                       request.url().includes('/v2/');
      
      if (isApiCall) {
        const requestData = {
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          timestamp: Date.now(),
          resourceType: request.resourceType()
        };
        this.networkRequests.push(requestData);
        logger.info(`🌐 API Request: ${request.method()} ${request.url()}`);
      }
    });

    // Monitor network responses
    this.page.on('response', response => {
      if (!this.networkActivityEnabled) return;
      
      // Only track API responses
      const isApiResponse = response.url().includes('/api/') ||
                           response.url().includes('/graphql') ||
                           response.url().includes('/rest/') ||
                           response.url().includes('/v1/') ||
                           response.url().includes('/v2/');
      
      if (isApiResponse) {
        const responseData = {
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          timestamp: Date.now()
        };
        this.networkResponses.push(responseData);
        logger.info(`📡 API Response: ${response.status()} ${response.url()}`);
      }
    });
  }

  /**
   * Disable network monitoring
   */
  disableNetworkMonitoring() {
    this.networkActivityEnabled = false;
  }

  /**
   * Inject alert scripts into the browser context
   */
  async injectAlertScripts() {
    try {
      // Read the alertScripts.js file and inject it
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const alertScriptsPath = path.join(__dirname, '..', 'utils', 'alertScripts.js');
      
      const alertScriptsContent = fs.readFileSync(alertScriptsPath, 'utf8');
      
      // Convert ES6 exports to regular function declarations for browser compatibility
      const browserCompatibleScript = alertScriptsContent
        .replace(/export function/g, 'function')
        .replace(/export \{[^}]+\}/g, '');
      
      // Extract the function definitions and inject them
      await this.page.evaluate((scriptContent) => {
        // Create a function that contains the alert script logic
        const alertFunctions = new Function(`
          ${scriptContent}
          
          // Make functions available globally
          window.validate = validate;
          window.showBrowserAlert = showBrowserAlert;
          window.showConsoleAlert = showConsoleAlert;
        `);
        
        alertFunctions();
      }, browserCompatibleScript);
      
      logger.info('Alert scripts injected into browser context');
    } catch (error) {
      logger.warn(`Failed to inject alert scripts: ${error.message}`);
    }
  }

  /**
   * Get network activity summary
   */
  getNetworkActivity() {
    return {
      requests: this.networkRequests,
      responses: this.networkResponses,
      totalRequests: this.networkRequests.length,
      totalResponses: this.networkResponses.length
    };
  }

  /**
   * Clear network monitoring data
   */
  clearNetworkData() {
    this.networkRequests = [];
    this.networkResponses = [];
  }

  /**
   * Execute an action based on the step configuration
   * @param {Object} step - The step configuration from the rule file
   * @returns {Promise<Object>} Result object with success status and data
   */
  async execute(step) {
    const { stepId, action, enabled = true } = step;

    if (enabled === false) {
      logger.info(`Step ${stepId} is disabled, skipping...`);
      return { success: true, skipped: true };
    }

    // Inject alert scripts on first execution
    if (!this.alertScriptsInjected) {
      await this.injectAlertScripts();
      this.alertScriptsInjected = true;
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
        case 'monitornetwork':
          result = await this.monitorNetwork(step);
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
    const { selector, highlight = true } = step;
    const convertedSelector = this.convertToCSSSelector(selector);
    
    // Log conversion if it changed
    if (convertedSelector !== selector) {
      logger.info(`Selector converted: "${selector}" -> "${convertedSelector}"`);
    }
    
    // Highlight element before clicking if enabled
    if (highlight) {
      await this.highlightElement(convertedSelector);
    }
    
    await this.page.click(convertedSelector, {
      timeout: step.timeout || config.timeouts.default
    });
    return { selector: convertedSelector };
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
    const { selector, text, highlight = true } = step;
    const convertedSelector = this.convertToCSSSelector(selector);
    
    // Log conversion if it changed
    if (convertedSelector !== selector) {
      logger.info(`Selector converted: "${selector}" -> "${convertedSelector}"`);
    }
    
    // Replace placeholders with stored data
    const processedText = this.replacePlaceholders(text);
    
    // Highlight element before filling if enabled
    if (highlight) {
      await this.highlightElement(convertedSelector);
    }
    
    await this.page.fill(convertedSelector, processedText, {
      timeout: step.timeout || config.timeouts.default
    });
    return { selector: convertedSelector, text: processedText };
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
    const { filename, fullPage, stepId, description } = step;
    const screenshotDir = config.screenshot.path;
    
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    // Generate filename with GUID if not provided
    let finalFilename;
    if (filename) {
      finalFilename = filename;
    } else {
      // Generate GUID-based filename using stepId + GUID
      const guid = this.generateGUID();
      finalFilename = `${stepId}-${guid}.png`;
    }
    
    const filepath = path.join(screenshotDir, finalFilename);
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
    const { selector, value, label, index, highlight = true } = step;
    
    // Highlight element before selecting if enabled
    if (highlight) {
      await this.highlightElement(selector);
    }
    
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
    const { selector, highlight = true } = step;
    
    // Highlight element before hovering if enabled
    if (highlight) {
      await this.highlightElement(selector);
    }
    
    await this.page.hover(selector, {
      timeout: step.timeout || config.timeouts.default
    });
    return { selector };
  }

  /**
   * Check a checkbox or radio button
   */
  async check(step) {
    const { selector, highlight = true } = step;
    
    // Highlight element before checking if enabled
    if (highlight) {
      await this.highlightElement(selector);
    }
    
    await this.page.check(selector, {
      timeout: step.timeout || config.timeouts.default
    });
    return { selector };
  }

  /**
   * Uncheck a checkbox
   */
  async uncheck(step) {
    const { selector, highlight = true } = step;
    
    // Highlight element before unchecking if enabled
    if (highlight) {
      await this.highlightElement(selector);
    }
    
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
      storeAs,
      script
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
        
        // Execute custom script if provided
        if (script) {
          try {
            // Ensure alert functions are available before executing script
            const isValidateAvailable = await this.page.evaluate(() => {
              return typeof window !== 'undefined' && typeof window.validate === 'function';
            });
            
            if (!isValidateAvailable) {
              // Read and inject the alertScripts.js file
              const fs = await import('fs');
              const path = await import('path');
              const { fileURLToPath } = await import('url');
              
              const __filename = fileURLToPath(import.meta.url);
              const __dirname = path.dirname(__filename);
              const alertScriptsPath = path.join(__dirname, '..', 'utils', 'alertScripts.js');
              
              const alertScriptsContent = fs.readFileSync(alertScriptsPath, 'utf8');
              
              // Convert ES6 exports to regular function declarations for browser compatibility
              const browserCompatibleScript = alertScriptsContent
                .replace(/export function/g, 'function')
                .replace(/export \{[^}]+\}/g, '');
              
              await this.page.evaluate((scriptContent) => {
                // Extract the function definitions and make them available globally
                const alertFunctions = new Function(`
                  ${scriptContent}
                  
                  // Make functions available globally
                  window.validate = validate;
                  window.showBrowserAlert = showBrowserAlert;
                  window.showConsoleAlert = showConsoleAlert;
                `);
                
                alertFunctions();
              }, browserCompatibleScript);
            }
            
            
            // Parse the script to extract function call
            const scriptMatch = script.match(/validate\('([^']+)',\s*'([^']+)'\)/);
            
            if (scriptMatch) {
              const [, message, type] = scriptMatch;
              await this.page.evaluate((args) => {
                if (typeof window.validate === 'function') {
                  return window.validate(args.message, args.type);
                } else {
                  throw new Error('validate function not available');
                }
              }, { message, type });
            } else {
              // Fallback to eval for other script types
              await this.page.evaluate((scriptToRun) => {
                return eval(scriptToRun);
              }, script);
            }
            logger.info('Custom validation script executed');
          } catch (scriptError) {
            logger.warn(`Script execution failed: ${scriptError.message}`);
          }
        }
        
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
   * Highlight an element on the page for visual feedback
   * @param {string} selector - The element selector to highlight
   * @param {number} duration - How long to show the highlight (ms)
   */
  async highlightElement(selector, duration = 800) {
    try {
      // Use Playwright's locator which handles all selector types
      const locator = this.page.locator(selector).first();
      
      // Wait briefly for element to be available
      await locator.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
      
      // Apply highlight using Playwright's evaluate on the element
      await locator.evaluate((element, dur) => {
        // Store original style
        const originalOutline = element.style.outline;
        const originalOutlineOffset = element.style.outlineOffset;
        const originalBoxShadow = element.style.boxShadow;
        
        // Apply highlight effect
        element.style.outline = '3px solid #ff6b6b';
        element.style.outlineOffset = '2px';
        element.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.6)';
        
        // Scroll element into view smoothly
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove highlight after duration
        setTimeout(() => {
          element.style.outline = originalOutline;
          element.style.outlineOffset = originalOutlineOffset;
          element.style.boxShadow = originalBoxShadow;
        }, dur);
      }, duration);
      
      // Wait a bit for the highlight to be visible
      await this.page.waitForTimeout(400);
    } catch (error) {
      // If highlight fails, just log it and continue
      logger.warn(`Failed to highlight element: ${error.message}`);
    }
  }

  /**
   * Monitor network activity and capture API calls
   */
  async monitorNetwork(step) {
    const { storeAs, duration = 5000 } = step;
    
    logger.info(`🔍 Starting API monitoring for ${duration}ms...`);
    
    // Clear previous network data
    this.clearNetworkData();
    
    // Wait for the specified duration to capture network activity
    await this.page.waitForTimeout(duration);
    
    // Get network activity summary
    const networkActivity = this.getNetworkActivity();
    
    // Create API-focused summary
    const apiSummary = {
      totalApiRequests: networkActivity.totalRequests,
      totalApiResponses: networkActivity.totalResponses,
      apiCalls: networkActivity.requests,
      apiResponses: networkActivity.responses,
      timestamp: Date.now()
    };
    
    // Log API summary
    logger.info(`📊 API Summary:`);
    logger.info(`   API Requests: ${apiSummary.totalApiRequests}`);
    logger.info(`   API Responses: ${apiSummary.totalApiResponses}`);
    
    // Log API calls with status
    if (apiSummary.apiCalls.length > 0) {
      logger.info(`🚀 API Calls Detected:`);
      apiSummary.apiCalls.forEach((req, index) => {
        const response = apiSummary.apiResponses.find(resp => resp.url === req.url);
        const status = response ? response.status : 'Pending';
        logger.info(`   ${index + 1}. ${req.method} ${req.url} - Status: ${status}`);
      });
    } else {
      logger.info(`ℹ️  No API calls detected during monitoring period`);
    }
    
    // Store network data if requested
    if (storeAs) {
      dataStore.set(storeAs, apiSummary);
    }
    
    return apiSummary;
  }

  /**
   * Generate a GUID (Globally Unique Identifier)
   */
  generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Convert HTML attribute format to proper CSS selector
   * Handles common cases where users copy HTML attributes directly
   */
  convertToCSSSelector(selector) {
    if (!selector || typeof selector !== 'string') {
      return selector;
    }

    // Handle type="submit" -> button[type='submit']
    if (selector.includes('type=')) {
      const typeMatch = selector.match(/type="([^"]+)"/);
      if (typeMatch) {
        const typeValue = typeMatch[1];
        // Common type values and their likely elements
        const typeToElement = {
          'submit': 'button',
          'button': 'button',
          'text': 'input',
          'email': 'input',
          'password': 'input',
          'checkbox': 'input',
          'radio': 'input',
          'file': 'input',
          'hidden': 'input',
          'number': 'input',
          'tel': 'input',
          'url': 'input',
          'search': 'input',
          'date': 'input',
          'time': 'input',
          'datetime-local': 'input',
          'month': 'input',
          'week': 'input',
          'color': 'input',
          'range': 'input'
        };
        
        const element = typeToElement[typeValue] || 'button';
        return `${element}[type='${typeValue}']`;
      }
    }

    // Handle class="..." -> .class-name
    if (selector.includes('class=')) {
      const classMatch = selector.match(/class="([^"]+)"/);
      if (classMatch) {
        const className = classMatch[1].split(' ')[0]; // Take first class
        return `.${className}`;
      }
    }

    // Handle id="..." -> #id
    if (selector.includes('id=')) {
      const idMatch = selector.match(/id="([^"]+)"/);
      if (idMatch) {
        return `#${idMatch[1]}`;
      }
    }

    // Handle name="..." -> [name='...']
    if (selector.includes('name=')) {
      const nameMatch = selector.match(/name="([^"]+)"/);
      if (nameMatch) {
        return `[name='${nameMatch[1]}']`;
      }
    }

    // Handle data-cy="..." -> [data-cy='...']
    if (selector.includes('data-cy=')) {
      const dataCyMatch = selector.match(/data-cy="([^"]+)"/);
      if (dataCyMatch) {
        return `[data-cy='${dataCyMatch[1]}']`;
      }
    }

    // Handle data-testid="..." -> [data-testid='...']
    if (selector.includes('data-testid=')) {
      const dataTestIdMatch = selector.match(/data-testid="([^"]+)"/);
      if (dataTestIdMatch) {
        return `[data-testid='${dataTestIdMatch[1]}']`;
      }
    }

    // If no conversion needed, return as-is
    return selector;
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

