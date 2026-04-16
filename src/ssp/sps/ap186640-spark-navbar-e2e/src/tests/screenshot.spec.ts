import { test } from '../fixtures';
import {
  VIEWPORT_PRESETS,
  takeMultiViewportScreenshots,
} from '@fmr-ap167419/shared-qe-automation-util-playwright';

/**
 * This test verifies the application's responsiveness across multiple em-based viewport sizes.
 * It navigates to the local app and captures screenshots at 32em, 60em, and 80em widths.
 * The screenshots help ensure UI consistency and correct layout at common breakpoints.
 */

test(
  'should test responsive breakpoints using em-based viewports',
  {
    tag: '@Visual',
  },
  async ({ page }) => {
    await page.goto(process.env.URL);

    // Test all the em-based breakpoints
    await takeMultiViewportScreenshots(
      page,
      {
        imageName: 'responsive',
        captureType: 'viewport',
        waitTimeout: 2000,
      },
      [
        VIEWPORT_PRESETS.width32em, // 32em = 512px
        VIEWPORT_PRESETS.width60em, // 60em = 960px
        VIEWPORT_PRESETS.width80em, // 80em = 1280px
      ],
    );
  },
);
