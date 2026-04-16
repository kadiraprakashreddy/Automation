import { test as base } from '@playwright/test';
// We are exporting the class definition so PascalCase is expected
// eslint-disable-next-line @typescript-eslint/naming-convention
import LandingPage from '../pages/landing-page';

/**
 * Playwright's fixture capabilities enable automatic injection of page objects into tests,
 * eliminating the need to manually create and manage page object instances.
 *
 * This approach provides several benefits:
 * - Automatic instantiation and cleanup of page objects
 * - Consistent setup across all tests
 * - Type safety with TypeScript
 * - Dependency injection pattern for better testability
 */
type PageFixture = {
  landingPage: LandingPage;
  // more page objects can be added here
};

export const test = base.extend<PageFixture>({
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
});

export { expect, Response } from '@playwright/test';
