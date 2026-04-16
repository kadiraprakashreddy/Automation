/**
 * @copyright 2026, FMR LLC
 * @file TermModelExportService to handle export of termination model data
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SDLContentService } from '../sdl-content/sdl-content.service';
import { ITerminationModelResourceBundle } from '../../models/termination-models/sdl-content/termination-sdl-content-model';
import { IExportReport } from '../../models/termination-models/sdl-content/export.model';
import { TermModelConstant } from '../../constants/term-model.constants';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { ErrorMessage } from '../../models/common/error-models/ErrorMessage';
import { ErrorHandlingUtils } from '../../utilities/error-handling-utils';
import { AnalyticsTag, AnalyticsUtilService } from '../analytics-util.service';
import { ErrorAnalytics } from '../../models/commonAnalytics/ErrorAnalytics';

@Injectable({
  providedIn: 'root',
})
export class TermModelExportService {
  /**
   * Signal for export report state
   * @private
   */
  private readonly _exportReport = signal<IExportReport | null | undefined>(
    null,
  );

  private readonly http = inject(HttpClient);
  private readonly sdlContentService = inject(SDLContentService);
  private readonly analyticsService = inject(AnalyticsUtilService);

  /**
   * Fetches and exports termination models by making an HTTP request to the provided URL.
   * If a term date is specified, appends additional query parameters for term ID, date, and ESPP indicator.
   * Downloads the response as an Excel file (.xlsx) and triggers a browser download.
   * Sends analytics for the export action.
   *
   * @param termModelUrl - The base URL for the termination model API. If null or undefined, an error event is sent.
   * @param termDate - Optional term date to include in the query parameters.
   * @param termId - Optional term ID to include in the query parameters, required if termDate is provided.
   * @param esppIndicator - Optional boolean indicating ESPP flag, converted to 'Y' or 'N' in the query.
   * @returns An Observable that completes when the export is successful or errors out on failure.
   */
  public fetchExportTermModels(
    termModelUrl: string | null | undefined,
    termDate: string | undefined,
    termId: string | undefined,
    esppIndicator: boolean | undefined,
  ): Observable<void> {
    const resourceBundle = this.sdlContentService
      .resourceBundles as ITerminationModelResourceBundle;
    this._exportReport.set(resourceBundle.exportReport);

    if (termModelUrl === null || termModelUrl === undefined) {
      return this.sendErrorEvent();
    } else {
      let apiUrl = termModelUrl + TermModelConstant.URL_REPORT;
      if (termDate !== undefined) {
        apiUrl =
          apiUrl +
          TermModelConstant.URL_TERM_ID +
          termId +
          TermModelConstant.AMP_TERM_DATE +
          termDate +
          TermModelConstant.ESPPFLAG +
          (esppIndicator ? TermModelConstant.Y : TermModelConstant.N);
      }

      return this.http
        .get(apiUrl, { responseType: 'blob', observe: 'response' })
        .pipe(
          tap((response) => {
            const blob = new Blob([response.body!], {
              type:
                response.headers.get(TermModelConstant.CONTENT_TYPE) ??
                undefined,
            });
            const reader = new FileReader();
            reader.readAsDataURL(blob); // converts the blob to base64 and calls onload
            reader.onload = () => {
              const link = document.createElement('a');
              link.download = this._exportReport()?.reportFileName + '.xlsx';
              link.href = reader.result as string; // data url
              link.click();
            };

            this.analyticsService.pageActionSubmitAnalytics(
              AnalyticsTag.userActionForSiteEvent,
              AnalyticsTag.terminationModeling,
              {
                actionDetail: AnalyticsTag.export,
                pageType: AnalyticsTag.export + AnalyticsTag.toExcel,
              },
            );
          }),
          map(() => void 0),
          catchError((err: HttpErrorResponse) => {
            if (err.error.type === 'application/json') {
              this.sendErrorEvent(
                new HttpErrorResponse({
                  error: JSON.parse(err.error.text()),
                  headers: err.headers,
                  status: err.status,
                  statusText: err.statusText,
                  url: err.url ?? undefined,
                }),
              );
            } else {
              this.sendErrorEvent();
            }
            return throwError(() => err);
          }),
        );
    }
  }

  /**
   * Creates an error observable for export failures
   * @private
   * @param err Optional HTTP error response
   * @returns Observable that throws an error
   */
  private sendErrorEvent(err?: HttpErrorResponse): Observable<never> {
    this.analyticsTagForExportError();
    let errorMessage: ErrorMessage;
    if (
      this.sdlContentService.resourceBundles === null ||
      this.sdlContentService.resourceBundles === undefined
    ) {
      errorMessage = ErrorHandlingUtils.getErrorMessage(err);
    } else {
      errorMessage = ErrorHandlingUtils.getErrorMessage(
        err,
        this.sdlContentService.resourceBundles.messages.serviceErrorTitle,
        this.sdlContentService.resourceBundles.messages.serviceErrorBody,
      );
    }
    return throwError(() => errorMessage);
  }

  private analyticsTagForExportError() {
    const errorAnalyticsArray: ErrorAnalytics[] = [];
    const errorAnalytics: ErrorAnalytics = {};
    errorAnalytics.field_name = AnalyticsTag.export + AnalyticsTag.toExcel;
    errorAnalytics.error_message = AnalyticsTag.systemError;
    errorAnalyticsArray.push(errorAnalytics);
    this.analyticsService.pageActionSubmitAnalytics(
      AnalyticsTag.userActionForSiteEvent,
      AnalyticsTag.terminationModeling,
      {
        actionDetail: AnalyticsTag.error,
        errorAnalyticsArray: errorAnalyticsArray,
        pageType: AnalyticsTag.export + AnalyticsTag.toExcel,
      },
    );
  }
}
