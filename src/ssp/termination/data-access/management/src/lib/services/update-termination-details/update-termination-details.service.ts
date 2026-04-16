/**
 * @copyright 2026, FMR LLC
 * @file This file contains service to update termination details
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { isNullOrUndefinedOrEmpty } from '../../validators/utils/utils.validator';
import { ModifyTerminationsModel } from '../../models/modify-terminations.model';
import { DatePipe } from '@angular/common';
import { SubmitAnalyticsService } from '../submit-analytics/submit-analytics.service';

export enum OPERATIONS {
  ADJUST,
  REVERSE,
}

export enum STATE {
  INITIAL,
  ADJUST,
  ADJUSTING,
  REVERSING,
  ERROR,
}

/**
 *
 *
 * @export
 * @class UpdateTerminationDetailsService
 */
@Injectable({
  providedIn: 'root',
})
export class UpdateTerminationDetailsService {
  /**
   * Signal for update success state
   * @private
   */
  private readonly _updateSuccess = signal<boolean>(false);

  /**
   * Observable stream for update success changes.
   * @type {Observable<boolean>}
   */
  public readonly updateSuccess: Observable<boolean> = toObservable(
    this._updateSuccess,
  );

  /**
   * Signal for update termination detail in progress state
   * @private
   */
  private readonly _updateTerminationDetailInProgress = signal<boolean>(false);

  /**
   * Observable stream for update termination detail in progress changes.
   * @type {Observable<boolean>}
   */
  public readonly updateTerminationDetailInProgress: Observable<boolean> =
    toObservable(this._updateTerminationDetailInProgress);

  private readonly datePipe = inject(DatePipe);
  private readonly analyticsService = inject(SubmitAnalyticsService);
  private readonly httpClient = inject(HttpClient);

  /**
   * method to adjust termination details  for the participant
   *
   * @param formData
   * @param updateUrl
   * @memberof UpdateTerminationDetailsService
   */
  public adjustTerminationDetails(
    formData: ModifyTerminationsModel,
    updateUrl: string,
  ): Observable<STATE> {
    return this.updateTerminationDetails(formData, STATE.ADJUSTING, updateUrl);
  }

  /**
   * method to reverse termination details  for the participant
   *
   * @param formData
   * @param updateUrl
   * @memberof UpdateTerminationDetailsService
   */
  public reverseTerminationDetails(
    formData: ModifyTerminationsModel,
    updateUrl: string,
  ): Observable<STATE> {
    formData.employmentDetails.terminationDetails!.terminationDate =
      this.constructReverseTerminationDate();
    return this.updateTerminationDetails(formData, STATE.REVERSING, updateUrl);
  }

  /**
   * Method to submit Analytics for the Adjust
   *
   * @param tagName
   */
  public submitAnalyticsForAdjust(tagName: string) {
    this.analyticsService.submitAnalytics('adjust' + '|' + tagName);
  }

  /**
   * Method to submit Analytics for the Reverse
   *
   * @param tagName
   */
  public submitAnalyticsForReverse(tagName: string) {
    this.analyticsService.submitAnalytics('reverse' + '|' + tagName);
  }

  /**
   * method to update termination details  for the participant
   *
   * @private
   * @param formData
   * @param state
   * @param updateUrl
   * @memberof UpdateTerminationDetailsService
   */
  private updateTerminationDetails(
    formData: ModifyTerminationsModel,
    state: STATE,
    updateUrl: string,
  ): Observable<STATE> {
    this._updateTerminationDetailInProgress.set(true);
    this._updateSuccess.set(false);
    const participantTerminationsUrl = updateUrl;
    if (isNullOrUndefinedOrEmpty(participantTerminationsUrl)) {
      this._updateTerminationDetailInProgress.set(false);
      return throwError(() => new Error('No termination update URL available'));
    } else {
      const httpOptions = {
        headers: { 'x-http-method-override': 'PUT' },
      };

      return this.httpClient
        .post(participantTerminationsUrl!, formData, httpOptions)
        .pipe(
          tap(() => {
            this._updateTerminationDetailInProgress.set(false);
            this._updateSuccess.set(true);
          }),
          map(() => state),
          catchError((error) => {
            this._updateTerminationDetailInProgress.set(false);
            throw error; // Re-throw the error so store can handle it
          }),
        );
    }
  }

  /**
   * construct reverse termination date
   *
   * @private
   * @return
   * @memberof UpdateTerminationDetailsService
   */
  private constructReverseTerminationDate(): string {
    const reverseDate = new Date();
    reverseDate.setDate(1);
    reverseDate.setMonth(0);
    reverseDate.setFullYear(1);
    return this.datePipe.transform(reverseDate, 'yyyy-MM-dd')!;
  }
}
