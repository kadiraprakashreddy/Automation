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
   * Click an element. `selectorMode`: testId (exact data-testid), id (exact id), html (paste element), css.
   */
  async click(step) {
    const { selector, highlight = true } = step;
    const raw = typeof selector === 'string' ? selector.trim() : selector;
    const mode = this.normalizeSelectorMode(step.selectorMode);
    const timeout = step.timeout || config.timeouts.default;

    if (mode === 'testid') {
      if (!raw) {
        throw new Error('selector (data-testid value) is required');
      }
      const loc = this.page.getByTestId(raw);
      const c = await loc.count();
      if (c === 0) {
        throw new Error(`No element with data-testid="${raw}"`);
      }
      if (c > 1) {
        logger.warn(`data-testid="${raw}" matched ${c} elements; clicking first.`);
      }
      logger.info(`Click by data-testid="${raw}" (exact)`);
      if (highlight) {
        await this.highlightLocator(loc);
      }
      await loc.first().click({ timeout });
      return { selector: raw, selectorMode: 'testId', matchedBy: 'data-testid' };
    }

    if (mode === 'id') {
      if (!raw) {
        throw new Error('selector (id value) is required');
      }
      const css = this.idValueToCssSelector(raw);
      logger.info(`Click by id="${raw}" (exact)`);
      if (highlight) {
        await this.highlightElement(css);
      }
      await this.page.click(css, { timeout });
      return { selector: raw, selectorMode: 'id', matchedBy: 'id' };
    }

    const useHtml =
      mode === 'html' ||
      (mode === 'auto' && raw && this.looksLikeHtmlElementSnippet(raw));

    if (useHtml) {
      if (mode === 'html' && (!raw || !this.looksLikeHtmlElementSnippet(raw))) {
        throw new Error('Html target mode requires pasted HTML starting with <tag');
      }
      const parsed = this.parseHtmlOpeningTag(raw);
      const wanted = this.wantedAttrsFromParsed(parsed);
      if (!wanted || Object.keys(wanted).length === 0) {
        if (mode === 'html') {
          throw new Error('Html target mode requires an opening tag with at least one attribute');
        }
      } else {
        const n = await this.countElementsMatchingPastedAttrs(parsed.tagName, wanted);
        if (n === 0) {
          throw new Error(
            `No element matched pasted <${parsed.tagName}> with attributes: ${Object.keys(wanted).join(', ')}`
          );
        }
        if (n > 1) {
          logger.warn(`Pasted HTML matched ${n} elements; clicking the first.`);
        }
        logger.info(
          `Click by pasted HTML: <${parsed.tagName}> (${Object.keys(wanted).length} attribute(s), exact match)`
        );
        const handle = await this.findFirstElementHandleMatchingPastedAttrs(parsed.tagName, wanted);
        if (!handle) {
          throw new Error('Could not resolve element for pasted HTML');
        }
        try {
          if (highlight) {
            await this.highlightElementHandle(handle);
          }
          await handle.click({ timeout });
        } finally {
          await handle.dispose();
        }
        return { selector: raw, selectorMode: 'html', matchedBy: 'html-paste' };
      }
    }

    const convertedSelector = this.resolveStepSelector(selector);
    if (convertedSelector !== selector) {
      logger.info(`Selector converted: "${selector}" -> "${convertedSelector}"`);
    }
    if (highlight) {
      await this.highlightElement(convertedSelector);
    }
    await this.page.click(convertedSelector, { timeout });
    return { selector: convertedSelector, selectorMode: 'css' };
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
    const raw = typeof selector === 'string' ? selector.trim() : selector;
    const mode = this.normalizeSelectorMode(step.selectorMode);
    const processedText = this.replacePlaceholders(text);
    const timeout = step.timeout || config.timeouts.default;

    if (mode === 'testid') {
      if (!raw) {
        throw new Error('selector (data-testid value) is required');
      }
      const loc = this.page.getByTestId(raw);
      const c = await loc.count();
      if (c === 0) {
        throw new Error(`No element with data-testid="${raw}"`);
      }
      if (c > 1) {
        logger.warn(`data-testid="${raw}" matched ${c} elements; filling first.`);
      }
      logger.info(`Fill by data-testid="${raw}" (exact)`);
      if (highlight) {
        await this.highlightLocator(loc);
      }
      await loc.first().fill(processedText, { timeout });
      return { selector: raw, text: processedText, selectorMode: 'testId', matchedBy: 'data-testid' };
    }

    if (mode === 'id') {
      if (!raw) {
        throw new Error('selector (id value) is required');
      }
      const css = this.idValueToCssSelector(raw);
      logger.info(`Fill by id="${raw}" (exact)`);
      if (highlight) {
        await this.highlightElement(css);
      }
      await this.page.fill(css, processedText, { timeout });
      return { selector: raw, text: processedText, selectorMode: 'id', matchedBy: 'id' };
    }

    const useHtml =
      mode === 'html' ||
      (mode === 'auto' && raw && this.looksLikeHtmlElementSnippet(raw));

    if (useHtml) {
      if (mode === 'html' && (!raw || !this.looksLikeHtmlElementSnippet(raw))) {
        throw new Error('Html target mode requires pasted HTML starting with <tag');
      }
      const parsed = this.parseHtmlOpeningTag(raw);
      const wanted = this.wantedAttrsFromParsed(parsed);
      if (!wanted || Object.keys(wanted).length === 0) {
        if (mode === 'html') {
          throw new Error('Html target mode requires an opening tag with at least one attribute');
        }
      } else {
        const n = await this.countElementsMatchingPastedAttrs(parsed.tagName, wanted);
        if (n === 0) {
          throw new Error(
            `No element matched pasted <${parsed.tagName}> with attributes: ${Object.keys(wanted).join(', ')}`
          );
        }
        if (n > 1) {
          logger.warn(`Pasted HTML matched ${n} elements; filling the first.`);
        }
        logger.info(
          `Fill by pasted HTML: <${parsed.tagName}> (${Object.keys(wanted).length} attribute(s), exact match)`
        );
        const handle = await this.findFirstElementHandleMatchingPastedAttrs(parsed.tagName, wanted);
        if (!handle) {
          throw new Error('Could not resolve element for pasted HTML');
        }
        try {
          if (highlight) {
            await this.highlightElementHandle(handle);
          }
          await handle.fill(processedText, { timeout });
        } finally {
          await handle.dispose();
        }
        return { selector: raw, text: processedText, selectorMode: 'html', matchedBy: 'html-paste' };
      }
    }

    const convertedSelector = this.resolveStepSelector(selector);
    if (convertedSelector !== selector) {
      logger.info(`Selector converted: "${selector}" -> "${convertedSelector}"`);
    }
    if (highlight) {
      await this.highlightElement(convertedSelector);
    }
    await this.page.fill(convertedSelector, processedText, { timeout });
    return { selector: convertedSelector, text: processedText, selectorMode: 'css' };
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
   * Validate when selector field is pasted HTML (attribute subset match).
   */
  async validateWithHtmlAttributeMatch(step, parsed, wanted, selectorLabel) {
    const {
      validationType,
      expectedValue,
      attribute,
      onFailure = 'console',
      failureMessage,
      continueOnFailure = false,
      storeAs,
      script
    } = step;
    const vt = validationType.toLowerCase();
    const n = await this.countElementsMatchingPastedAttrs(parsed.tagName, wanted);
    const selector = selectorLabel;

    let actualValue;
    let validationPassed = false;
    let validationResult = {};

    try {
      switch (vt) {
        case 'exists':
          validationPassed = n > 0;
          actualValue = validationPassed ? 'Element exists' : 'Element not found';
          validationResult = { selector, validationPassed, actualValue };
          break;

        case 'notexists':
          validationPassed = n === 0;
          actualValue = !validationPassed ? 'Element exists' : 'Element not found';
          validationResult = { selector, validationPassed, actualValue };
          break;

        case 'count':
          validationPassed = n === parseInt(expectedValue, 10);
          actualValue = n;
          validationResult = { selector, expectedValue, actualValue, validationPassed };
          break;

        case 'visible':
        case 'textequals':
        case 'textcontains':
        case 'attributeequals': {
          if (n === 0) {
            throw new Error(`No element matched pasted <${parsed.tagName}> for ${vt}`);
          }
          const h = await this.findFirstElementHandleMatchingPastedAttrs(parsed.tagName, wanted);
          try {
            if (vt === 'visible') {
              validationPassed = await h.isVisible();
              actualValue = validationPassed ? 'Element visible' : 'Element not visible';
              validationResult = { selector, validationPassed, actualValue };
            } else if (vt === 'textequals' || vt === 'textcontains') {
              actualValue = await h.textContent();
              validationPassed =
                vt === 'textequals'
                  ? actualValue === expectedValue
                  : !!(actualValue && actualValue.includes(expectedValue));
              validationResult = { selector, expectedValue, actualValue, validationPassed };
            } else {
              if (!attribute) {
                throw new Error('Attribute name is required for attributeEquals validation');
              }
              actualValue = await h.getAttribute(attribute);
              validationPassed = actualValue === expectedValue;
              validationResult = { selector, attribute, expectedValue, actualValue, validationPassed };
            }
          } finally {
            await h.dispose();
          }
          break;
        }

        default:
          throw new Error(`Validation type "${validationType}" is not supported with Html target`);
      }

      if (storeAs) {
        dataStore.set(storeAs, validationPassed);
        logger.info(`Stored validation result as '${storeAs}': ${validationPassed}`);
      }

      if (!validationPassed) {
        const message =
          failureMessage || `Validation failed: Expected ${expectedValue}, but got ${actualValue}`;
        logger.warn(`VALIDATION FAILED: ${message}`);
        if (script) {
          logger.warn('Custom failure script is not run for Html-target validation');
        }
        await this.showValidationNotification(onFailure, message, false);
        if (!continueOnFailure) {
          throw new Error(message);
        }
      } else {
        logger.info(`VALIDATION PASSED: ${validationType} for pasted HTML`);
      }

      return validationResult;
    } catch (error) {
      const message = failureMessage || error.message;
      logger.error(`Validation error: ${message}`);
      await this.showValidationNotification(onFailure, message, false);
      if (!continueOnFailure) {
        throw error;
      }
      return { validationPassed: false, error: message };
    }
  }

  /**
   * Validate elements and data on the page
   * Supports multiple validation types and notification methods
   */
  async validate(step) {
    const {
      validationType,
      selector: selectorInput,
      expectedValue,
      attribute,
      onFailure = 'console',
      failureMessage,
      continueOnFailure = false,
      storeAs,
      script
    } = step;

    const mode = this.normalizeSelectorMode(step.selectorMode);
    const rawTrim = typeof selectorInput === 'string' ? selectorInput.trim() : selectorInput;

    if (mode === 'html' || (mode === 'auto' && rawTrim && this.looksLikeHtmlElementSnippet(rawTrim))) {
      const parsed = this.parseHtmlOpeningTag(selectorInput || '');
      const wanted = this.wantedAttrsFromParsed(parsed);
      if (wanted && Object.keys(wanted).length > 0) {
        return this.validateWithHtmlAttributeMatch(step, parsed, wanted, selectorInput);
      }
      if (mode === 'html') {
        throw new Error('Html target requires pasted HTML with at least one attribute');
      }
    }

    let selector = selectorInput;
    if (mode === 'testid') {
      if (!rawTrim) {
        throw new Error('selector (data-testid) is required');
      }
      selector = this.exactAttrSelector('data-testid', rawTrim);
    } else if (mode === 'id') {
      if (!rawTrim) {
        throw new Error('selector (id) is required');
      }
      selector = this.idValueToCssSelector(rawTrim);
    } else {
      selector = this.resolveStepSelector(selectorInput);
    }

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
        
        // Minimal scroll — avoids shifting layout vs manual browsing (block: center can jump the page)
        element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
        
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

  async highlightElementHandle(elementHandle, duration = 800) {
    try {
      await elementHandle.evaluate((element, dur) => {
        const originalOutline = element.style.outline;
        const originalOutlineOffset = element.style.outlineOffset;
        const originalBoxShadow = element.style.boxShadow;
        element.style.outline = '3px solid #ff6b6b';
        element.style.outlineOffset = '2px';
        element.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.6)';
        element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
        setTimeout(() => {
          element.style.outline = originalOutline;
          element.style.outlineOffset = originalOutlineOffset;
          element.style.boxShadow = originalBoxShadow;
        }, dur);
      }, duration);
      await this.page.waitForTimeout(400);
    } catch (error) {
      logger.warn(`Failed to highlight element: ${error.message}`);
    }
  }

  async highlightLocator(locator, duration = 800) {
    try {
      const first = locator.first();
      await first.waitFor({ state: 'visible', timeout: 2000 }).catch(() => {});
      await first.evaluate(
        (element, dur) => {
          const originalOutline = element.style.outline;
          const originalOutlineOffset = element.style.outlineOffset;
          const originalBoxShadow = element.style.boxShadow;
          element.style.outline = '3px solid #ff6b6b';
          element.style.outlineOffset = '2px';
          element.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.6)';
          element.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
          setTimeout(() => {
            element.style.outline = originalOutline;
            element.style.outlineOffset = originalOutlineOffset;
            element.style.boxShadow = originalBoxShadow;
          }, dur);
        },
        duration
      );
      await this.page.waitForTimeout(400);
    } catch (error) {
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
   * CSS #id only works for simple ids. Spaces, colons, etc. need [id="..."].
   */
  idValueToCssSelector(idValue) {
    if (!idValue || typeof idValue !== 'string') {
      return idValue;
    }
    const v = idValue.trim();
    if (/^[A-Za-z_][\w-]*$/.test(v)) {
      return `#${v}`;
    }
    const escaped = v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `[id="${escaped}"]`;
  }

  /** Rule step `selectorMode`: auto = legacy (html-shaped string → attribute match). */
  normalizeSelectorMode(mode) {
    if (mode == null || mode === '') {
      return 'auto';
    }
    const s = String(mode).toLowerCase();
    if (s === 'testid') {
      return 'testid';
    }
    if (s === 'id') {
      return 'id';
    }
    if (s === 'html') {
      return 'html';
    }
    if (s === 'css') {
      return 'css';
    }
    return 'auto';
  }

  /** CSS for an exact attribute value (used for data-testid). */
  exactAttrSelector(attrName, value) {
    const v = String(value);
    const escaped = v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `[${attrName}="${escaped}"]`;
  }

  /**
   * True if pasted text looks like an HTML element (e.g. from DevTools Copy → outerHTML).
   */
  looksLikeHtmlElementSnippet(s) {
    const t = s.trim();
    if (!t.startsWith('<') || t.startsWith('<!') || t.startsWith('<?')) {
      return false;
    }
    if (/^<\s*\//.test(t)) {
      return false;
    }
    return /^<\s*[a-zA-Z][\w:-]*/.test(t);
  }

  /**
   * Parse the opening tag of an HTML snippet and return { tagName, attrs } (attr names lowercased).
   * Handles quoted values and newlines inside the tag; stops at first > outside quotes.
   */
  parseHtmlOpeningTag(html) {
    const t = html.trim();
    if (!this.looksLikeHtmlElementSnippet(t)) {
      return null;
    }
    let i = 1;
    while (i < t.length && /\s/.test(t[i])) {
      i++;
    }
    const nameStart = i;
    while (i < t.length && /[\w:-]/.test(t[i])) {
      i++;
    }
    if (nameStart === i) {
      return null;
    }
    const tagName = t.slice(nameStart, i).toLowerCase();
    const attrs = {};
    while (i < t.length) {
      while (i < t.length && /\s/.test(t[i])) {
        i++;
      }
      if (t[i] === '>' || (t[i] === '/' && t[i + 1] === '>')) {
        break;
      }
      if (!t[i]) {
        break;
      }
      const attrNameStart = i;
      while (i < t.length && /[\w.-]/.test(t[i])) {
        i++;
      }
      if (attrNameStart === i) {
        i++;
        continue;
      }
      const attrName = t.slice(attrNameStart, i).toLowerCase();
      while (i < t.length && /\s/.test(t[i])) {
        i++;
      }
      if (t[i] !== '=') {
        attrs[attrName] = '';
        continue;
      }
      i++;
      while (i < t.length && /\s/.test(t[i])) {
        i++;
      }
      let val = '';
      if (t[i] === '"') {
        i++;
        while (i < t.length && t[i] !== '"') {
          val += t[i];
          i++;
        }
        if (t[i] === '"') {
          i++;
        }
      } else if (t[i] === "'") {
        i++;
        while (i < t.length && t[i] !== "'") {
          val += t[i];
          i++;
        }
        if (t[i] === "'") {
          i++;
        }
      } else {
        while (i < t.length && !/[\s>\/]/.test(t[i])) {
          val += t[i];
          i++;
        }
      }
      attrs[attrName] = val;
    }
    return { tagName, attrs };
  }

  /**
   * Normalize parsed attributes for DOM comparison (HTML attribute names are case-insensitive).
   */
  wantedAttrsFromParsed(parsed) {
    if (!parsed) {
      return null;
    }
    const wanted = {};
    for (const [k, v] of Object.entries(parsed.attrs)) {
      wanted[String(k).toLowerCase()] = v == null ? '' : String(v);
    }
    return wanted;
  }

  async countElementsMatchingPastedAttrs(tagName, wanted) {
    return this.page.evaluate(
      ({ tag, wanted: w }) => {
        function attrMatches(el) {
          for (const [key, val] of Object.entries(w)) {
            const got = el.getAttribute(key);
            if (got === null) {
              return false;
            }
            const gt = String(got).trim();
            const vt = String(val).trim();
            if (gt !== vt && gt.toLowerCase() !== vt.toLowerCase()) {
              return false;
            }
          }
          return true;
        }
        const list = document.getElementsByTagName(tag);
        let n = 0;
        for (let i = 0; i < list.length; i++) {
          if (attrMatches(list[i])) {
            n++;
          }
        }
        return n;
      },
      { tag: tagName, wanted }
    );
  }

  async findFirstElementHandleMatchingPastedAttrs(tagName, wanted) {
    const handle = await this.page.evaluateHandle(
      ({ tag, wanted: w }) => {
        function attrMatches(el) {
          for (const [key, val] of Object.entries(w)) {
            const got = el.getAttribute(key);
            if (got === null) {
              return false;
            }
            const gt = String(got).trim();
            const vt = String(val).trim();
            if (gt !== vt && gt.toLowerCase() !== vt.toLowerCase()) {
              return false;
            }
          }
          return true;
        }
        const list = document.getElementsByTagName(tag);
        for (let i = 0; i < list.length; i++) {
          if (attrMatches(list[i])) {
            return list[i];
          }
        }
        return null;
      },
      { tag: tagName, wanted }
    );
    const element = handle.asElement();
    if (!element) {
      await handle.dispose();
      return null;
    }
    return handle;
  }

  /**
   * Plain CSS or legacy snippets (type=, class=, id=, …). Pasted HTML is handled in click/fill via attribute match.
   */
  resolveStepSelector(selector) {
    if (!selector || typeof selector !== 'string') {
      return selector;
    }
    const trimmed = selector.trim();
    if (/^\[\s*[iI][dD]\s*=/.test(trimmed)) {
      return trimmed.replace(/^\[(\s*)[iI][dD](\s*=\s*)/, '[$1id$2');
    }
    return this.convertToCSSSelector(selector);
  }

  /**
   * Convert HTML attribute format to proper CSS selector
   * Handles common cases where users copy HTML attributes directly
   */
  convertToCSSSelector(selector) {
    if (!selector || typeof selector !== 'string') {
      return selector;
    }

    // Handle type="submit" / type='text' (HTML-ish snippets) -> proper CSS
    if (selector.includes('type=')) {
      const typeMatch = selector.match(/type=["']([^"']+)["']/);
      if (typeMatch) {
        const typeValue = typeMatch[1];
        // Common type values and their likely elements
        const typeToElement = {
          submit: 'button',
          button: 'button',
          text: 'input',
          email: 'input',
          password: 'input',
          checkbox: 'input',
          radio: 'input',
          file: 'input',
          hidden: 'input',
          number: 'input',
          tel: 'input',
          url: 'input',
          search: 'input',
          date: 'input',
          time: 'input',
          'datetime-local': 'input',
          month: 'input',
          week: 'input',
          color: 'input',
          range: 'input',
          reset: 'button'
        };

        let element = typeToElement[typeValue];
        if (element === undefined) {
          element = 'button';
        }
        // submit/reset can be <input> or <button>; infer tag from the snippet
        if (typeValue === 'submit' || typeValue === 'reset') {
          const head = selector.trim();
          const tagMatch =
            head.match(/^<\s*(input|button)\b/i) ||
            head.match(/^(input|button)[\s[/]/i);
          if (tagMatch) {
            element = tagMatch[1].toLowerCase();
          }
        }

        return `${element}[type='${typeValue}']`;
      }
    }

    // id= before class= so snippets like <a class="..." id="..."> resolve to id
    if (selector.includes('id=')) {
      let m = selector.match(/id="([^"]+)"/);
      if (m) {
        return this.idValueToCssSelector(m[1]);
      }
      m = selector.match(/id='([^']+)'/);
      if (m) {
        return this.idValueToCssSelector(m[1]);
      }
      m = selector.trim().match(/^id\s*=\s*(.+)$/i);
      if (m) {
        return this.idValueToCssSelector(m[1].trim());
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

