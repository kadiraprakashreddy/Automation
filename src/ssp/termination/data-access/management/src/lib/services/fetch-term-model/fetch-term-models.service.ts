/**
 * @copyright 2026, FMR LLC
 * @file This file contains service to fetch term models
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { isNullOrUndefinedOrEmpty } from '../../validators/utils/utils.validator';
import { IAward } from '../../models/award.model';
import { IPreTermination } from '../../models/pre-termination.model';
import { IPostTermination } from '../../models/post-termination.model';
import { IVesting } from '../../models/vesting.model';
import { vestingDetailsNotAvailable } from '../../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class FetchTermModelsService {
  /**
   * Store term Date
   *
   * @memberof FetchTermModelsService
   */
  public termDate = signal<string | undefined>(undefined);

  /**
   * Store term id
   *
   * @memberof FetchTermModelsService
   */
  public termId = signal<string | undefined>(undefined);

  /**
   * Computed API URL based on current termDate and termId signals
   *
   * @memberof FetchTermModelsService
   */
  public readonly apiUrl = computed(() => {
    const date = this.termDate();
    const id = this.termId();
    return date && id ? `?termId=${id}&termDate=${date}` : '';
  });

  private readonly httpClient = inject(HttpClient);

  /**
   * Method to fetch term model using signals for state management
   */
  public fetchTermModels(
    termModelUrl: string | null | undefined,
    termDate: string | undefined,
    termId: string | undefined,
  ): Observable<IAward> {
    if (!termModelUrl) {
      return this.sendErrorEvent();
    }

    // Update signals with new values
    if (termDate !== undefined) {
      this.termDate.set(termDate);
      this.termId.set(termId);
    }

    const fullUrl = termModelUrl + this.apiUrl();

    return this.httpClient.get<IAward>(fullUrl).pipe(
      tap((response) => {
        if (isNullOrUndefinedOrEmpty(response)) {
          throw new Error('Empty response received from term model service');
        }
      }),
      map((response) => this.handleTermModelServiceResponse(response)),
      catchError((error: HttpErrorResponse) => this.sendErrorEvent(error)),
    );
  }

  /**
   * Handles successful term model service response
   * @param termModelServiceResponse
   */
  private handleTermModelServiceResponse(
    termModelServiceResponse: IAward,
  ): IAward {
    for (const plan of termModelServiceResponse.plans) {
      for (const grant of plan.grants) {
        if (grant.vestings.length < 1) {
          const preTerminationVesting: IPreTermination = {
            outstandingQuantity: Number.NaN,
            exercisableQuantity: Number.NaN,
            unvestedQuantity: Number.NaN,
            vestingDate: vestingDetailsNotAvailable.notAvailable,
            status: vestingDetailsNotAvailable.notAvailable,
            expirationDate: vestingDetailsNotAvailable.notAvailable,
          };

          const postTerminationVesting: IPostTermination = {
            forfeitedQuantity: Number.NaN,
            retainedQuantity: Number.NaN,
            retainedExercisableQuantity: Number.NaN,
            retainedUnvested: Number.NaN,
            retainedValue: Number.NaN,
            vestingDate: vestingDetailsNotAvailable.notAvailable,
            status: vestingDetailsNotAvailable.notAvailable,
            expirationDate: vestingDetailsNotAvailable.notAvailable,
          };

          const vestings: IVesting = {
            preTerminationVesting,
            postTerminationVesting,
          };
          grant.vestings.push(vestings);
        }
      }
    }

    return termModelServiceResponse;
  }

  /**
   * Method to set page error
   *
   * @private
   * @param [error]
   * @memberof FetchTermModelsService
   */
  private sendErrorEvent(error?: Error | HttpErrorResponse): Observable<never> {
    const httpError =
      error instanceof HttpErrorResponse
        ? error
        : new HttpErrorResponse({
            error: error?.message ?? 'Unknown error',
            status: 0,
            statusText: 'Unknown Error',
          });

    return throwError(() => httpError);
  }
}
