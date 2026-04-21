/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file This is service file for fetching list of available term rule IDs
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, inject, signal } from '@angular/core';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import { SDLContentService } from '../sdl-content/sdl-content.service';
import { ErrorHandlingUtils } from '../../utilities/error-handling-utils';
import { ErrorMessage } from '../../models/common/error-models/ErrorMessage';
import { TermRuleIdsModel } from '../../models/term-rule-ids.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Service to fetch term rule IDs
 * @export
 * @class TermRuleIdsService
 */
@Injectable({
  providedIn: 'root',
})
export class TermRuleIdsService {
  /**
   * Signal for term rule IDs state
   * @private
   */
  private readonly _termRuleIds = signal<TermRuleIdsModel | null>(null);

  /**
   * Signal for error state
   * @private
   */
  private readonly _error = signal<ErrorMessage | null>(null);

  /**
   * Observable stream for term rule IDs changes.
   * Replaces ReplaySubject with signal-based reactivity.
   * Only emits when data is available (filters out null values).
   *
   * @type {Observable<TermRuleIdsModel>}
   * @memberof TermRuleIdsService
   */
  public readonly termRuleIdsResponse: Observable<TermRuleIdsModel> =
    toObservable(this._termRuleIds).pipe(
      filter((data): data is TermRuleIdsModel => data !== null),
    );

  /**
   * Current term rule IDs model
   * @type {TermRuleIdsModel | null | undefined}
   * @memberof TermRuleIdsService
   */
  public termRuleIdsModel: TermRuleIdsModel | null | undefined;

  private readonly windowService = inject(FdWindowService);
  private readonly sdlContentService = inject(SDLContentService);
  private readonly httpClient = inject(HttpClient);

  /**
   * Fetches term rule IDs available for a given participant.
   * Updates internal signals for reactive state management.
   * @returns {Observable<TermRuleIdsModel>} An observable emitting the fetched data on success.
   * @throws {HttpErrorResponse} If the request fails or response is invalid.
   * @example
   * service.fetchTermRuleIds().subscribe(data => console.log(data));
   */
  public fetchTermRuleIds(): Observable<TermRuleIdsModel> {
    const windowObj = this.windowService.getWindow();
    if (windowObj?.apis?.termRuleIds) {
      const termRuleIdsUrl = this.windowService.getWindow().apis.termRuleIds;
      return this.httpClient.get<TermRuleIdsModel>(termRuleIdsUrl).pipe(
        tap((response) => {
          this.termRuleIdsModel = response;
          this._termRuleIds.set(response);
          this._error.set(null);
        }),
        map((response) => response),
        catchError((err) => {
          return this.sendErrorEvent(err);
        }),
      );
    } else {
      return this.sendErrorEvent();
    }
  }

  /**
   * Method to set page error
   * @private
   * @param [error] Optional error to handle
   * @returns {Observable<never>} Throws an error observable
   * @memberof TermRuleIdsService
   */
  private sendErrorEvent(error?: HttpErrorResponse): Observable<never> {
    const errorMessage =
      this.sdlContentService.resourceBundles === null ||
      this.sdlContentService.resourceBundles === undefined
        ? ErrorHandlingUtils.getErrorMessage(error)
        : ErrorHandlingUtils.getErrorMessage(
            error,
            this.sdlContentService.resourceBundles.messages.serviceErrorTitle,
            this.sdlContentService.resourceBundles.messages.serviceErrorBody,
          );
    // TODO: Review if we need to clear termRuleIds on error
    // this._error.set(errorMessage);
    // this._termRuleIds.set(null);

    return throwError(() => errorMessage);
  }
}
