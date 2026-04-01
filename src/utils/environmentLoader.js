import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

/**
 * Centralized Environment Configuration Loader
 * Loads environment variables from root .env file for all projects
 */
class EnvironmentLoader {
  constructor() {
    this.env = {};
    this.loadEnvironment();
  }

  /**
   * Load environment variables from root .env file
   */
  loadEnvironment() {
    const rootDir = path.resolve(process.cwd());
    const envFile = path.join(rootDir, '.env');
    const envDir = path.join(rootDir, 'environment');
    
    // Check if .env file exists in root
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });
      console.log(`✅ Loaded environment from: ${envFile}`);
    } else {
      // Check if .env file exists in environment folder
      const envFileInFolder = path.join(envDir, '.env');
      if (fs.existsSync(envFileInFolder)) {
        dotenv.config({ path: envFileInFolder });
        console.log(`✅ Loaded environment from: ${envFileInFolder}`);
      } else {
        console.warn(`⚠️ No .env file found at: ${envFile} or ${envFileInFolder}`);
        console.log('📝 Using default environment variables');
      }
    }

    // Load environment variables into this.env
    this.env = {
      // Project Configuration
      PROJECT_NAME: process.env.PROJECT_NAME || 'Playwright Automation Engine',
      PROJECT_VERSION: process.env.PROJECT_VERSION || '1.0.0',
      PROJECT_DESCRIPTION: process.env.PROJECT_DESCRIPTION || 'Create and manage automation rules with a visual interface',
      
      // Environment
      NODE_ENV: process.env.NODE_ENV || 'development',
      ENVIRONMENT: process.env.ENVIRONMENT || 'development',
      
      // Server Configuration
      API_PORT: parseInt(process.env.API_PORT) || 3000,
      API_HOST: process.env.API_HOST || 'localhost',
      API_URL: process.env.API_URL || 'http://localhost:3000',
      API_BASE_PATH: process.env.API_BASE_PATH || '/api',
      
      WS_PORT: parseInt(process.env.WS_PORT) || 8081,
      WS_HOST: process.env.WS_HOST || 'localhost',
      WS_URL: process.env.WS_URL || 'ws://localhost:8081',
      
      UI_PORT: parseInt(process.env.UI_PORT) || 4200,
      UI_HOST: process.env.UI_HOST || 'localhost',
      UI_URL: process.env.UI_URL || 'http://localhost:4200',
      
      // Feature Flags
      ENABLE_LOGGING: process.env.ENABLE_LOGGING === 'true',
      ENABLE_SCREENSHOTS: process.env.ENABLE_SCREENSHOTS === 'true',
      ENABLE_WEBSOCKET: process.env.ENABLE_WEBSOCKET === 'true',
      ENABLE_DEBUG_MODE: process.env.ENABLE_DEBUG_MODE === 'true',
      ENABLE_PERFORMANCE_MONITORING: process.env.ENABLE_PERFORMANCE_MONITORING === 'true',
      ENABLE_ERROR_REPORTING: process.env.ENABLE_ERROR_REPORTING === 'true',
      ENABLE_CRASH_REPORTING: process.env.ENABLE_CRASH_REPORTING === 'true',
      ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
      ENABLE_USER_TRACKING: process.env.ENABLE_USER_TRACKING === 'true',
      ENABLE_EXTERNAL_INTEGRATIONS: process.env.ENABLE_EXTERNAL_INTEGRATIONS === 'true',
      
      // UI Configuration
      DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
      AUTO_REFRESH_INTERVAL: parseInt(process.env.AUTO_REFRESH_INTERVAL) || 5000,
      LOG_MAX_LINES: parseInt(process.env.LOG_MAX_LINES) || 1000,
      MAX_CONCURRENT_AUTOMATIONS: parseInt(process.env.MAX_CONCURRENT_AUTOMATIONS) || 5,
      
      // Timeouts
      API_TIMEOUT: parseInt(process.env.API_TIMEOUT) || 30000,
      WS_RECONNECT_INTERVAL: parseInt(process.env.WS_RECONNECT_INTERVAL) || 5000,
      WS_MAX_RECONNECT_ATTEMPTS: parseInt(process.env.WS_MAX_RECONNECT_ATTEMPTS) || 5,
      FILE_UPLOAD_TIMEOUT: parseInt(process.env.FILE_UPLOAD_TIMEOUT) || 60000,
      
      // Browser Configuration
      BROWSER_TYPE: process.env.BROWSER_TYPE || 'chromium',
      HEADLESS: process.env.HEADLESS === 'true',
      VIEWPORT_WIDTH: parseInt(process.env.VIEWPORT_WIDTH) || 1920,
      VIEWPORT_HEIGHT: parseInt(process.env.VIEWPORT_HEIGHT) || 1080,
      /** When true, Playwright uses the real browser window size (no fixed viewport). Fixes “narrow / left” layout in headed runs. */
      USE_WINDOW_VIEWPORT: process.env.USE_WINDOW_VIEWPORT === 'true',
      
      // Rule Engine Timeouts
      DEFAULT_TIMEOUT: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
      NAVIGATION_TIMEOUT: parseInt(process.env.NAVIGATION_TIMEOUT) || 60000,
      ELEMENT_TIMEOUT: parseInt(process.env.ELEMENT_TIMEOUT) || 10000,
      
      // Screenshot Configuration
      SCREENSHOT_ON_ERROR: process.env.SCREENSHOT_ON_ERROR !== 'false',
      SCREENSHOT_PATH: process.env.SCREENSHOT_PATH || './screenshots',
      SCREENSHOT_FORMAT: process.env.SCREENSHOT_FORMAT || 'png',
      SCREENSHOT_QUALITY: parseInt(process.env.SCREENSHOT_QUALITY) || 90,
      
      // Logging Configuration
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
      LOG_PATH: process.env.LOG_PATH || './logs',
      LOG_CONSOLE: process.env.LOG_CONSOLE !== 'false',
      LOG_FILE: process.env.LOG_FILE !== 'false',
      
      // Network Monitoring
      NETWORK_MONITORING: process.env.NETWORK_MONITORING === 'true',
      NETWORK_LOG_REQUESTS: process.env.NETWORK_LOG_REQUESTS !== 'false',
      NETWORK_LOG_RESPONSES: process.env.NETWORK_LOG_RESPONSES !== 'false',
      NETWORK_FILTER_API_ONLY: process.env.NETWORK_FILTER_API_ONLY !== 'false',
      
      // Performance Settings
      MAX_CONCURRENT_STEPS: parseInt(process.env.MAX_CONCURRENT_STEPS) || 1,
      STEP_DELAY: parseInt(process.env.STEP_DELAY) || 1000,
      RETRY_ATTEMPTS: parseInt(process.env.RETRY_ATTEMPTS) || 3,
      RETRY_DELAY: parseInt(process.env.RETRY_DELAY) || 2000,
      
      // Security Settings
      ALLOW_INSECURE_REQUESTS: process.env.ALLOW_INSECURE_REQUESTS === 'true',
      IGNORE_HTTPS_ERRORS: process.env.IGNORE_HTTPS_ERRORS === 'true',
      ENABLE_CORS: process.env.ENABLE_CORS !== 'false',
      ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
      
      // Performance Optimization
      ENABLE_LAZY_LOADING: process.env.ENABLE_LAZY_LOADING !== 'false',
      ENABLE_TREE_SHAKING: process.env.ENABLE_TREE_SHAKING !== 'false',
      ENABLE_COMPRESSION: process.env.ENABLE_COMPRESSION === 'true',
      
      // Development Settings
      SHOW_CONSOLE_LOGS: process.env.SHOW_CONSOLE_LOGS !== 'false',
      ENABLE_SOURCE_MAPS: process.env.ENABLE_SOURCE_MAPS !== 'false',
      ENABLE_HOT_RELOAD: process.env.ENABLE_HOT_RELOAD !== 'false',
      
      // Debug Information
      SHOW_ENVIRONMENT: process.env.SHOW_ENVIRONMENT !== 'false',
      SHOW_VERSION: process.env.SHOW_VERSION !== 'false',
      SHOW_BUILD_INFO: process.env.SHOW_BUILD_INFO !== 'false',
      ENABLE_DEV_TOOLS: process.env.ENABLE_DEV_TOOLS !== 'false',
      
      // External Services
      EXTERNAL_API_URL: process.env.EXTERNAL_API_URL || '',
      EXTERNAL_API_KEY: process.env.EXTERNAL_API_KEY || '',
      
      // Build Information
      BUILD_TIMESTAMP: process.env.BUILD_TIMESTAMP || new Date().toISOString(),
      BUILD_VERSION: process.env.BUILD_VERSION || '1.0.0',
      GIT_COMMIT: process.env.GIT_COMMIT || 'unknown'
    };
  }

  /**
   * Get environment variable value
   */
  get(key) {
    return this.env[key];
  }

  /**
   * Get all environment variables
   */
  getAll() {
    return this.env;
  }

  /**
   * Check if running in specific environment
   */
  isEnvironment(env) {
    return this.env.ENVIRONMENT === env;
  }

  /**
   * Check if running in development
   */
  isDevelopment() {
    return this.isEnvironment('development');
  }

  /**
   * Check if running in staging
   */
  isStaging() {
    return this.isEnvironment('staging');
  }

  /**
   * Check if running in production
   */
  isProduction() {
    return this.isEnvironment('production');
  }

  /**
   * Check if running in test
   */
  isTest() {
    return this.isEnvironment('test');
  }

  /**
   * Get environment-specific configuration
   */
  getEnvironmentConfig() {
    const configs = {
      development: {
        logLevel: 'debug',
        enableSourceMaps: true,
        enableHotReload: true,
        showConsoleLogs: true,
        headless: false,
        enableDevTools: true
      },
      staging: {
        logLevel: 'warn',
        enableSourceMaps: false,
        enableHotReload: false,
        showConsoleLogs: false,
        headless: true,
        enableDevTools: false
      },
      production: {
        logLevel: 'error',
        enableSourceMaps: false,
        enableHotReload: false,
        showConsoleLogs: false,
        headless: true,
        enableDevTools: false
      },
      test: {
        logLevel: 'debug',
        enableSourceMaps: true,
        enableHotReload: true,
        showConsoleLogs: true,
        headless: true,
        enableDevTools: true
      }
    };

    return configs[this.env.ENVIRONMENT] || configs.development;
  }

  /**
   * Print environment information
   */
  printEnvironmentInfo() {
    if (this.env.SHOW_ENVIRONMENT) {
      console.log('🌍 Environment Configuration:');
      console.log(`   Environment: ${this.env.ENVIRONMENT}`);
      console.log(`   Node Environment: ${this.env.NODE_ENV}`);
      console.log(`   Project: ${this.env.PROJECT_NAME} v${this.env.PROJECT_VERSION}`);
      console.log(`   API URL: ${this.env.API_URL}`);
      console.log(`   WebSocket URL: ${this.env.WS_URL}`);
      console.log(`   UI URL: ${this.env.UI_URL}`);
      console.log(`   Debug Mode: ${this.env.ENABLE_DEBUG_MODE}`);
      console.log(`   Log Level: ${this.env.LOG_LEVEL}`);
      console.log('');
    }
  }
}

// Create singleton instance
const environmentLoader = new EnvironmentLoader();

// Export for both CommonJS and ES modules
export default environmentLoader;
export { EnvironmentLoader };

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { default: environmentLoader, EnvironmentLoader };
}
