import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // uses Base URL set in playwright.config.ts
    // so you can use links root-relative to the demo/ folder
    await page.goto('/demo/pages/success/success.html');
});

test.describe('Termination Rules e2e tests', () => {

    test('should display welcome message on success example 1', async ({ page }) => {
        await expect(page.locator('app-root h1')).toHaveText('Termination Rules');
    });

});
