/**
 * E2E Test Suite: Initial Project Page
 *
 * This test suite validates the core functionality and behavior of the initial project page.
 * It covers basic page loading, element visibility, and user interactions to ensure
 * the page works correctly across different scenarios.
 */
import { expect, test } from '../fixtures';

/**
 * Test Setup: Common preconditions for all tests in this suite
 *
 * This beforeEach hook runs before every test case and ensures:
 * - The application is navigated to the correct starting page
 * - The page is in a clean, predictable state
 * - Any necessary setup is completed before test execution
 *
 * Benefits of using beforeEach:
 * - Ensures test isolation and independence
 * - Reduces code duplication across test cases
 * - Provides consistent starting conditions
 */
test.beforeEach(async ({ page }) => {
  await test.step('Load the URL for the initial setup project', async () => {
    // Navigate to the Base URL of the application
    await page.goto(process.env.URL);
  });
});

test(
  'WIDPQA-123456: Verify the initial page is loading',
  { tag: ['@Functional'] },
  async ({ landingPage }) => {
    await test.step('Verify the Jill and Jack text are displayed', async () => {
      // Assert that Jill's text is visible
      await expect(landingPage.jillText).toBeVisible();

      // Assert that Jack's text contains the expected value
      await expect(landingPage.jackText).toHaveText("Jack's id is: 2");
    });
  },
);
