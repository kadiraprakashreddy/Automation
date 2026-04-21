/**
 * @copyright 2026, FMR LLC
 * @file Service for fetching employment details from the participant API
 */
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmploymentDetailsModel } from '../../models/employment-details.model';
import { isNullOrUndefinedOrEmpty } from '../../validators/utils/utils.validator';
import { ParticipantWindow } from '../../models/participant-window';

/**
 * Service for retrieving employment details from the configured API endpoint.
 *
 * This service fetches employee data through the participant window API configuration.
 * It handles API endpoint validation and normalizes error responses to HttpErrorResponse.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class EmploymentDetailsService {
  private readonly document = inject(DOCUMENT);
  private readonly httpClient = inject(HttpClient);

  /**
   * Fetches employment details from the configured API endpoint.
   *
   * Retrieves the employment details URL from the participant window configuration
   * and makes an HTTP GET request to fetch the data.
   *
   * @returns Observable containing employment details
   * @throws HttpErrorResponse when API endpoint is unavailable or request fails
   */
  public fetchEmployeeDetails(): Observable<EmploymentDetailsModel> {
    const employmentDetailsUrl = (
      this.document.defaultView as unknown as ParticipantWindow
    )?.apis?.employmentdetails;

    if (isNullOrUndefinedOrEmpty(employmentDetailsUrl)) {
      return this.sendErrorEvent();
    }

    return this.httpClient
      .get<EmploymentDetailsModel>(employmentDetailsUrl, {
        observe: 'response',
      })
      .pipe(
        map((resp) => {
          const body = resp.body as EmploymentDetailsModel & {
            errors?: unknown[];
          };

          // Some APIs return business errors in a 200 payload; normalize those to HttpErrorResponse.
          if (Array.isArray(body?.errors) && body.errors.length > 0) {
            throw new HttpErrorResponse({
              error: body,
              status: 0,
              statusText: 'Unknown Error',
            });
          }

          return body as EmploymentDetailsModel;
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            return throwError(() => err);
          }
          return this.sendErrorEvent(err as Error);
        }),
      );
  }

  /**
   * Creates and returns an error observable with normalized HttpErrorResponse.
   *
   * Converts various error types into a consistent HttpErrorResponse format
   * for uniform error handling downstream.
   *
   * @param error - Optional error object to normalize
   * @returns Observable that immediately errors with HttpErrorResponse
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
