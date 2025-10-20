import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  browser: {
    type: process.env.BROWSER_TYPE || 'chromium',
    headless: process.env.HEADLESS === 'true',
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH) || 1920,
      height: parseInt(process.env.VIEWPORT_HEIGHT) || 1080
    }
  },
  timeouts: {
    default: parseInt(process.env.DEFAULT_TIMEOUT) || 30000,
    navigation: parseInt(process.env.NAVIGATION_TIMEOUT) || 60000
  },
  screenshot: {
    onError: process.env.SCREENSHOT_ON_ERROR !== 'false',
    path: process.env.SCREENSHOT_PATH || './screenshots'
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    path: process.env.LOG_PATH || './logs'
  }
};

export default config;

