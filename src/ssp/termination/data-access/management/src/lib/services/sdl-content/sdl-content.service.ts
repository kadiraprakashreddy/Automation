/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file This is service file for fetching SDL content
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { Injectable, inject } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ParticipantUI } from '../participant-ui/participant-ui.service';
import {
  ISDLContent,
  ISDLResourceBundle,
} from '../../models/sdl-resource-bundle.model';
import { isNullOrUndefinedOrEmpty } from '../../validators/utils/utils.validator';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import { Observable, throwError } from 'rxjs';

/**
 * Service to fetch SDL content
 * @export
 * @class SDLContentService
 */
@Injectable({
  providedIn: 'root',
})
export class SDLContentService {
  /**
   *
   * @type {ISDLContent}
   * @memberof SDLContentService
   */
  public content!: ISDLContent;

  /**
   *
   *
   * @type {ResourceBundles}
   * @memberof SDLContentService
   */
  public resourceBundles!: ISDLResourceBundle;

  private readonly windowService = inject(FdWindowService);
  private readonly participantUI = inject(ParticipantUI);
  private readonly httpClient = inject(HttpClient);

  public fetchSDLContent(): Observable<ISDLContent> {
    const participantContentUrl = isNullOrUndefinedOrEmpty(
      this.participantUI.contentURI,
    )
      ? this.windowService.getWindow().apis.termModelContent
      : this.participantUI.contentURI;
    // participantContentUrl += '?serverErrorScenario=true';
    if (isNullOrUndefinedOrEmpty(participantContentUrl)) {
      return this.sendErrorEvent();
    }
    return this.httpClient
      .get<{ content: ISDLContent }>(participantContentUrl)
      .pipe(
        tap((participantTerminationsTridionModel) => {
          if (participantTerminationsTridionModel?.content?.resourceBundles) {
            this.content = participantTerminationsTridionModel.content;
            this.resourceBundles = this.content.resourceBundles;
          } else {
            // if empty response, send error event
            throw new HttpErrorResponse({
              error: 'No resource bundles in response',
              status: 200,
              statusText: 'OK',
              url: participantContentUrl,
            });
          }
        }),
        map((response) => response.content),
        catchError((err) => this.sendErrorEvent(err)),
      );
  }

  /**
   * Method to set page error
   */
  private sendErrorEvent(error?: Error | HttpErrorResponse): Observable<never> {
    const httpError =
      error instanceof HttpErrorResponse
        ? error
        : new HttpErrorResponse({
            error: error?.message,
            status: 500,
            statusText: 'Unknown Error',
          });

    return throwError(() => httpError);
  }
}
