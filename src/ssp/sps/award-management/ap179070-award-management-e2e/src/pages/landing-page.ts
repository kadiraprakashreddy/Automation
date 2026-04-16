/**
 * Page Object Model for the initial project page used in E2E tests.
 *
 * This class follows the Page Object Model (POM) design pattern, which provides:
 * - Centralized element locators and page interactions
 * - Reusable methods for common page operations
 * - Better maintainability when UI changes occur
 * - Improved test readability and organization
 *
 * Each element or interaction should be represented as a property or method within this class.
 */
import { Locator, Page } from '@playwright/test';

/**
 * Page object for the initial project page used in e2e tests.
 *
 * This class centralizes locators and and each element or interaction is represented as a method within this class
 */
export default class LandingPage {
  readonly page: Page;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByText('Award management center');
  }
}
