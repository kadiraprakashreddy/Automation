import environmentLoader from './environmentLoader.js';

// Use centralized environment configuration
const config = {
  browser: {
    type: environmentLoader.get('BROWSER_TYPE'),
    headless: environmentLoader.get('HEADLESS'),
    viewport: {
      width: environmentLoader.get('VIEWPORT_WIDTH'),
      height: environmentLoader.get('VIEWPORT_HEIGHT')
    },
    useWindowViewport: environmentLoader.get('USE_WINDOW_VIEWPORT')
  },
  timeouts: {
    default: environmentLoader.get('DEFAULT_TIMEOUT'),
    navigation: environmentLoader.get('NAVIGATION_TIMEOUT'),
    element: environmentLoader.get('ELEMENT_TIMEOUT')
  },
  screenshot: {
    onError: environmentLoader.get('SCREENSHOT_ON_ERROR'),
    path: environmentLoader.get('SCREENSHOT_PATH'),
    format: environmentLoader.get('SCREENSHOT_FORMAT'),
    quality: environmentLoader.get('SCREENSHOT_QUALITY')
  },
  logging: {
    level: environmentLoader.get('LOG_LEVEL'),
    path: environmentLoader.get('LOG_PATH'),
    console: environmentLoader.get('LOG_CONSOLE'),
    file: environmentLoader.get('LOG_FILE')
  },
  network: {
    monitoring: environmentLoader.get('NETWORK_MONITORING'),
    logRequests: environmentLoader.get('NETWORK_LOG_REQUESTS'),
    logResponses: environmentLoader.get('NETWORK_LOG_RESPONSES'),
    filterApiOnly: environmentLoader.get('NETWORK_FILTER_API_ONLY')
  },
  performance: {
    maxConcurrentSteps: environmentLoader.get('MAX_CONCURRENT_STEPS'),
    stepDelay: environmentLoader.get('STEP_DELAY'),
    retryAttempts: environmentLoader.get('RETRY_ATTEMPTS'),
    retryDelay: environmentLoader.get('RETRY_DELAY')
  },
  security: {
    allowInsecureRequests: environmentLoader.get('ALLOW_INSECURE_REQUESTS'),
    ignoreHttpsErrors: environmentLoader.get('IGNORE_HTTPS_ERRORS')
  },
  development: {
    debugMode: environmentLoader.get('ENABLE_DEBUG_MODE'),
    verboseLogging: environmentLoader.get('LOG_LEVEL') === 'debug',
    showBrowser: !environmentLoader.get('HEADLESS')
  }
};

export default config;

