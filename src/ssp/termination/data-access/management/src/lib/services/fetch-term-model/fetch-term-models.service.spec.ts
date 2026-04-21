/**
 * @copyright 2026, FMR LLC
 * @file This file contains unit tests for FetchTermModelsService
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import {
  HttpMethod,
  SpectatorHttp,
  createHttpFactory,
} from '@ngneat/spectator/jest';
import { HttpErrorResponse } from '@angular/common/http';
import { FetchTermModelsService } from './fetch-term-models.service';
import { IAward } from '../../models/award.model';
import { IPlanDetail } from '../../models/plan-details.model';
import { vestingDetailsNotAvailable } from '../../constants/app.constants';

describe('FetchTermModelsService', () => {
  let spectator: SpectatorHttp<FetchTermModelsService>;
  const createHttp = createHttpFactory(FetchTermModelsService);

  beforeEach(() => {
    spectator = createHttp();
  });

  describe('Signal state management', () => {
    it('should initialize with undefined termDate and termId signals', () => {
      expect(spectator.service.termDate()).toBeUndefined();
      expect(spectator.service.termId()).toBeUndefined();
    });

    it('should update termDate and termId signals', () => {
      spectator.service.termDate.set('2026-01-15');
      spectator.service.termId.set('TERM123');

      expect(spectator.service.termDate()).toBe('2026-01-15');
      expect(spectator.service.termId()).toBe('TERM123');
    });
  });

  describe('fetchTermModels', () => {
    it('should return error when termModelUrl is null', (done) => {
      spectator.service.fetchTermModels(null, null, null).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(HttpErrorResponse);
          expect(error.status).toBe(0);
          expect(error.statusText).toBe('Unknown Error');
          done();
        },
      });
    });

    it('should return error when termModelUrl is undefined', (done) => {
      spectator.service.fetchTermModels(undefined, null, null).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(HttpErrorResponse);
          expect(error.status).toBe(0);
          expect(error.statusText).toBe('Unknown Error');
          done();
        },
      });
    });

    it('should make HTTP request with correct URL when termDate and termId are provided', () => {
      const mockResponse: IAward = {
        modeledDate: '2026-01-15',
        divisionalRestricted: false,
        partialDivisionalRestricted: false,
        noGrants: false,
        links: null,
        plans: [
          {
            planType: 'RSU',
            grants: [
              {
                vestings: [
                  {
                    preTerminationVesting: {
                      outstandingQuantity: 100,
                      exercisableQuantity: 50,
                      unvestedQuantity: 50,
                      vestingDate: '2026-06-15',
                      status: 'Active',
                      expirationDate: '2027-01-15',
                    },
                    postTerminationVesting: {
                      forfeitedQuantity: 25,
                      retainedQuantity: 75,
                      retainedExercisableQuantity: 50,
                      retainedUnvested: 25,
                      retainedValue: 7500,
                      vestingDate: '2026-06-15',
                      status: 'Retained',
                      expirationDate: '2027-01-15',
                    },
                  },
                ],
              },
            ],
          } as IPlanDetail,
        ],
      };

      spectator.service
        .fetchTermModels(
          'https://api.example.com/termmodels',
          '2026-01-15',
          'TERM123',
        )
        .subscribe();

      const req = spectator.expectOne(
        'https://api.example.com/termmodels?termId=TERM123&termDate=2026-01-15',
        HttpMethod.GET,
      );
      req.flush(mockResponse);

      expect(spectator.service.termDate()).toBe('2026-01-15');
      expect(spectator.service.termId()).toBe('TERM123');
    });

    it('should handle HTTP error responses', (done) => {
      spectator.service
        .fetchTermModels(
          'https://api.example.com/termmodels',
          '2026-01-15',
          'TERM123',
        )
        .subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeInstanceOf(HttpErrorResponse);
            expect(error.status).toBe(500);
            expect(error.statusText).toBe('Server Error');
            done();
          },
        });

      const req = spectator.expectOne(
        'https://api.example.com/termmodels?termId=TERM123&termDate=2026-01-15',
        HttpMethod.GET,
      );
      req.flush('Server Error', { status: 500, statusText: 'Server Error' });
    });

    it('should add default vesting when grants have no vestings', () => {
      const mockResponse: IAward = {
        modeledDate: '2026-01-15',
        divisionalRestricted: false,
        partialDivisionalRestricted: false,
        noGrants: false,
        links: null,
        plans: [
          {
            planType: 'RSU',
            grants: [
              {
                vestings: [], // Empty vestings array
              },
            ],
          } as IPlanDetail,
        ],
      };

      spectator.service
        .fetchTermModels(
          'https://api.example.com/termmodels',
          '2026-01-15',
          'TERM123',
        )
        .subscribe((result) => {
          expect(result.plans[0].grants[0].vestings).toHaveLength(1);

          const vesting = result.plans[0].grants[0].vestings[0];
          expect(vesting.preTerminationVesting.vestingDate).toBe(
            vestingDetailsNotAvailable.notAvailable,
          );
          expect(vesting.preTerminationVesting.status).toBe(
            vestingDetailsNotAvailable.notAvailable,
          );
          expect(vesting.postTerminationVesting.vestingDate).toBe(
            vestingDetailsNotAvailable.notAvailable,
          );
          expect(vesting.postTerminationVesting.status).toBe(
            vestingDetailsNotAvailable.notAvailable,
          );
        });

      const req = spectator.expectOne(
        'https://api.example.com/termmodels?termId=TERM123&termDate=2026-01-15',
        HttpMethod.GET,
      );
      req.flush(mockResponse);
    });
  });
});
