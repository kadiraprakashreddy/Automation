/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file This Service is responsible for making Analytics calls.
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, inject } from '@angular/core';
import { FdAnalyticsService } from '@fmr-ap123285/angular-utils';

/**
 *
 *
 * @export
 * @class SubmitAnalyticsService
 */
@Injectable()
export class SubmitAnalyticsService {
  private readonly fdAnalyticsService = inject(FdAnalyticsService);

  /**
   * Helper method to get the feature string message for the analytics.
   *
   */
  public submitAnalytics(tagName: string): void {
    this.fdAnalyticsService.submitAnalytics({
      page_name: tagName,
      site_events: {
        spa_page_view: true,
      },
    });
  }
}
