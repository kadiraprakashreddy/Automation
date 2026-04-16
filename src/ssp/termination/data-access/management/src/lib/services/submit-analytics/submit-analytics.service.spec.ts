/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file Test file for submit analytics service
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable @typescript-eslint/naming-convention */
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { FdAnalyticsService } from '@fmr-ap123285/angular-utils';
import { SubmitAnalyticsService } from './submit-analytics.service';

describe('SubmitAnalyticsService', () => {
  let spectator: SpectatorService<SubmitAnalyticsService>;
  const createService = createServiceFactory({
    service: SubmitAnalyticsService,
    mocks: [FdAnalyticsService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('submitAnalytics', () => {
    it('should call fdAnalyticsService.submitAnalytics with correct parameters', () => {
      const fdAnalyticsService = spectator.inject(FdAnalyticsService);
      fdAnalyticsService.submitAnalytics.andReturn();

      const tagName = 'test-tag';
      spectator.service.submitAnalytics(tagName);

      expect(fdAnalyticsService.submitAnalytics).toHaveBeenCalledWith({
        page_name: tagName,
        site_events: {
          spa_page_view: true,
        },
      });
    });
  });
});
