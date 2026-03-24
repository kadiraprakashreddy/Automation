import type { PlaywrightTestConfig } from '@playwright/test';
/* add devices import if you want to run tests against emulated devices */
// import { devices } from '@playwright/test';

const isCIEnvironment = process.env.CI;
/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    testDir: './e2e',
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!isCIEnvironment,
    /* Retry on CI only */
    retries: isCIEnvironment ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: isCIEnvironment ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        ['list'],
        ['html', { open: isCIEnvironment ? 'never' : 'on-failure' }]
    ],
    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    outputDir: 'playwright-artifacts/',
    /* Run local dev server before starting the tests */
    webServer: {
        command: 'npm run dev',
        port: 4200
    },
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:4201',
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry'
    },
    /* Browser configurations */
    projects: [
        /* uses the chrome browser available on the machine */
        {
            name: 'chrome',
            use: {
                channel: 'chrome'
            }
        }
        // /* uses latest chromium build (to test upcoming Chrome or Edge releases) -- installed via `npx playwright install` */
        // {
        //     name: 'chromium',
        //     use: {
        //         ...devices['Desktop Chrome']
        //     }
        // }
        /* uses latest firefox stable build -- installed via `npx playwright install` */
        // {
        //     name: 'firefox',
        //     use: {
        //         ...devices['Desktop Firefox']
        //     }
        // },
        /* uses latest webkit trunk build, before it is used in Apple Safari  -- installed via `npx playwright install` */
        // {
        //     name: 'webkit',
        //     use: {
        //         ...devices['Desktop Safari']
        //     }
        // },
        /* uses the edge browser available on the machine */
        // {
        //   name: 'Microsoft Edge',
        //   use: {
        //     channel: 'msedge'
        //   },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   }
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12']
        //   },
        // }
    ]
};

export default config;
