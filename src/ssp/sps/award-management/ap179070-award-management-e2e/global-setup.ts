/**
 * Global Setup Configuration for Playwright E2E Tests
 *
 * This file contains the global setup configuration that runs once before all tests.
 * It handles environment configuration and any other global initialization required for the test suite.
 */
import {
  setupDotenv,
  setupEcsVault,
} from '@fmr-ap167419/shared-qe-automation-util-playwright';

/**
 * Global setup function that runs once before all test suites.
 * *
 * @example
 * // This function is automatically called by Playwright before test execution
 * // Configuration in playwright.config.ts:
 */
const globalSetup = async (): Promise<void> => {
  if (process.env['ENV'] === 'local') {
    setupDotenv();
  } else {
    setupEcsVault(__dirname);
  }
};

// Export the global setup function as default export
// This is required by Playwright's global setup configuration
export default globalSetup;
