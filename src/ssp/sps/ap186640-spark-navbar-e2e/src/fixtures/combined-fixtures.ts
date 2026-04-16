import { mergeTests } from '@playwright/test';
import { test as baseFixtures } from './base-fixtures';
import { test as catFixtures } from '@fmr-ap167419/shared-qe-automation-util-playwright';

/**
 * Combined fixture that merges page objects with CAT accessibility testing
 *
 * This approach merges:
 * - Base fixtures: Page objects (landingPage, etc.) from ./base-fixtures
 * - CAT fixtures: Direct import from shared library package
 *
 * Usage: This is the default fixture - provides both page objects AND automatic CAT scanning
 * All tests should use this via: import { test, expect } from '../fixtures';
 *
 * Based on: https://cat.fmr.com/docs/cat-pw.html
 */

// determine if we need to add CAT fixtures or just use the base fixture
const skipAccessibility = process.env.SKIP_ACCESSIBILITY === 'true';

// Merge base fixtures (page objects) with CAT fixtures (accessibility) or use base fixture alone
export const test = skipAccessibility
  ? baseFixtures
  : mergeTests(baseFixtures, catFixtures);
export { expect, Response } from '@playwright/test';
