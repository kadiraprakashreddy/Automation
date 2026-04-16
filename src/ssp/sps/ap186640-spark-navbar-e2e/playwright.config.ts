import {
  catEnhancedConfig,
  wiMonorepoPlaywrightBaseConfig,
} from '@fmr-ap167419/shared-qe-automation-util-playwright';
import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { workspaceRoot } from '@nx/devkit';
import { config as dotenvConfig } from 'dotenv';

/**
 * WI Monorepo Playwright Configuration for E2E Tests
 * Loads environment variables and sets up test configurations located in ./src/resources/environments
 * @example
 * `npx nx run project-name:e2e --env=ENV_NAME`
 * where `ENV_NAME` is one of the supported environments (e.g., FAC, LOCAL, DIT, FIN)
 */
dotenvConfig({
  path: `${__dirname}/src/resources/environments/${process.env['ENV']}.env`,
  override: true,
  quiet: true,
});

// For CD, you need to set URL to the deployed application.
const baseURL = process.env['URL'] || 'http://localhost:4200';

// Determine if running CAT accessibility tests
const skipAccessibility = process.env.SKIP_ACCESSIBILITY === 'true';

const playwrightConfiguration: PlaywrightTestConfig = {
  ...nxE2EPreset(__filename, { testDir: './src' }),
  // Use CAT-enhanced config for accessibility tests, otherwise use base config
  ...(skipAccessibility ? wiMonorepoPlaywrightBaseConfig : catEnhancedConfig),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    screenshot: 'on',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // Enhanced settings for CAT accessibility tests
    ...(!skipAccessibility
      ? {
          actionTimeout: 30000,
          navigationTimeout: 60000,
        }
      : {}),
  },
  /* Run your local dev server before running e2e tests, but only when testing locally */
  webServer: !process.env['env']
    ? {
        command: 'npx nx serve sps-ap186640-spark-navbar',
        port: 4200,
        reuseExistingServer: !process.env.CI,
        cwd: workspaceRoot,
        timeout: 300000, // 5 minutes timeout - Windows machines require extended time for webpack build to complete
      }
    : undefined,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
};

export default defineConfig(playwrightConfiguration);
