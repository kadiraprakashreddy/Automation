/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-assertions-in-tests */
/**
 * @copyright 2026, FMR LLC
 * @file Test file for update termination details service
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import {
  STATE,
  UpdateTerminationDetailsService,
} from './update-termination-details.service';
import { SDLContentService } from '../sdl-content/sdl-content.service';
import { SubmitAnalyticsService } from '../submit-analytics/submit-analytics.service';
import { ModifyTerminationsModel } from '../../models/modify-terminations.model';

describe('UpdateTerminationDetailsService', () => {
  let spectator: SpectatorService<UpdateTerminationDetailsService>;
  const createService = createServiceFactory({
    service: UpdateTerminationDetailsService,
    mocks: [HttpClient, DatePipe, SDLContentService, SubmitAnalyticsService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('adjustTerminationDetails', () => {
    it('should call updateTerminationDetails with STATE.ADJUSTING', (done) => {
      const formData = {} as ModifyTerminationsModel;
      const updateUrl = 'test-url';
      const httpClient = spectator.inject(HttpClient);
      httpClient.post.andReturn(of({}));

      spectator.service
        .adjustTerminationDetails(formData, updateUrl)
        .subscribe((state) => {
          expect(state).toBe(STATE.ADJUSTING);
          expect(httpClient.post).toHaveBeenCalledWith(updateUrl, formData, {
            headers: { 'x-http-method-override': 'PUT' },
          });
          done();
        });
    });
  });

  describe('reverseTerminationDetails', () => {
    it('should set terminationDate and call updateTerminationDetails with STATE.REVERSING', (done) => {
      const formData = {
        employmentDetails: {
          terminationDetails: {
            terminationDate: 'original-date',
          },
        },
      } as ModifyTerminationsModel;
      const updateUrl = 'test-url';
      const httpClient = spectator.inject(HttpClient);
      httpClient.post.andReturn(of({}));
      const datePipe = spectator.inject(DatePipe);
      datePipe.transform.andReturn('0001-01-01');

      spectator.service
        .reverseTerminationDetails(formData, updateUrl)
        .subscribe((state) => {
          expect(state).toBe(STATE.REVERSING);
          expect(
            formData.employmentDetails.terminationDetails!.terminationDate,
          ).toBe('0001-01-01');
          expect(httpClient.post).toHaveBeenCalledWith(updateUrl, formData, {
            headers: { 'x-http-method-override': 'PUT' },
          });
          done();
        });
    });
  });

  describe('submitAnalyticsForAdjust', () => {
    it('should call analyticsService.submitAnalytics with adjust tag', () => {
      const analyticsService = spectator.inject(SubmitAnalyticsService);
      analyticsService.submitAnalytics.andReturn();

      spectator.service.submitAnalyticsForAdjust('test-tag');

      expect(analyticsService.submitAnalytics).toHaveBeenCalledWith(
        'adjust|test-tag',
      );
    });
  });

  describe('submitAnalyticsForReverse', () => {
    it('should call analyticsService.submitAnalytics with reverse tag', () => {
      const analyticsService = spectator.inject(SubmitAnalyticsService);
      analyticsService.submitAnalytics.andReturn();

      spectator.service.submitAnalyticsForReverse('test-tag');

      expect(analyticsService.submitAnalytics).toHaveBeenCalledWith(
        'reverse|test-tag',
      );
    });
  });

  describe('updateTerminationDetails', () => {
    it('should throw error if updateUrl is null or empty', (done) => {
      const formData = {} as ModifyTerminationsModel;
      const updateUrl = '';

      spectator.service['updateTerminationDetails'](
        formData,
        STATE.ADJUSTING,
        updateUrl,
      ).subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error.message).toBe('No termination update URL available');
          done();
        },
      });
    });

    it('should make http post and handle success', (done) => {
      const formData = {} as ModifyTerminationsModel;
      const updateUrl = 'test-url';
      const httpClient = spectator.inject(HttpClient);
      httpClient.post.andReturn(of({}));

      spectator.service['updateTerminationDetails'](
        formData,
        STATE.ADJUSTING,
        updateUrl,
      ).subscribe((state) => {
        expect(state).toBe(STATE.ADJUSTING);
        spectator.service['_updateTerminationDetailInProgress'].update(
          (val) => {
            expect(val).toBe(false);
            return val;
          },
        );
        spectator.service['_updateSuccess'].update((val) => {
          expect(val).toBe(true);
          return val;
        });
        expect(httpClient.post).toHaveBeenCalledWith(updateUrl, formData, {
          headers: { 'x-http-method-override': 'PUT' },
        });
        done();
      });
    });

    it('should handle http error', (done) => {
      const formData = {} as ModifyTerminationsModel;
      const updateUrl = 'test-url';
      const httpClient = spectator.inject(HttpClient);
      const testError = new Error('test error');
      httpClient.post.andReturn(throwError(() => testError));

      spectator.service['updateTerminationDetails'](
        formData,
        STATE.ADJUSTING,
        updateUrl,
      ).subscribe({
        next: () => fail('Should have thrown error'),
        error: (error) => {
          expect(error).toBe(testError);
          spectator.service['_updateTerminationDetailInProgress'].update(
            (val) => {
              expect(val).toBe(false);
              return val;
            },
          );
          spectator.service['_updateSuccess'].update((val) => {
            expect(val).toBe(false);
            return val;
          });
          done();
        },
      });
    });
  });

  describe('constructReverseTerminationDate', () => {
    it('should return 0001-01-01', () => {
      const datePipe = spectator.inject(DatePipe);
      datePipe.transform.andReturn('0001-01-01');

      const result = spectator.service['constructReverseTerminationDate']();

      expect(result).toBe('0001-01-01');
      expect(datePipe.transform).toHaveBeenCalledWith(
        expect.any(Date),
        'yyyy-MM-dd',
      );
    });
  });

  describe('signals and observables', () => {
    it('should initialize signals correctly', (done) => {
      spectator.service.updateSuccess.subscribe((value) => {
        expect(value).toBe(false);
      });
      spectator.service.updateTerminationDetailInProgress.subscribe((value) => {
        expect(value).toBe(false);
        done();
      });
    });

    it('should emit updateSuccess changes', (done) => {
      spectator.service.updateSuccess.subscribe((value) => {
        if (value === true) {
          done();
        }
      });
      spectator.service['_updateSuccess'].set(true);
    });

    it('should emit updateTerminationDetailInProgress changes', (done) => {
      spectator.service.updateTerminationDetailInProgress.subscribe((value) => {
        if (value === true) {
          done();
        }
      });
      spectator.service['_updateTerminationDetailInProgress'].set(true);
    });
  });
});
