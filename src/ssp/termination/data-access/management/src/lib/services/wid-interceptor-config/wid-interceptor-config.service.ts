/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { HeaderInterceptorConfigService } from '@fmr-ap123285/angular-utils';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ParticipantWindow } from '../../models/participant-window';

/**
 * Service that provides WID (Workload ID) header configuration for HTTP interceptors.
 * Implements HeaderInterceptorConfigService to inject WID header into specific HTTP requests.
 *
 * @example
 * ```typescript
 * // Provided in root, used by widInterceptorFactory
 * {
 *   provide: HTTP_INTERCEPTORS,
 *   useFactory: widInterceptorFactory,
 *   multi: true,
 *   deps: [WidInterceptorConfigService],
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class WidInterceptorConfigService implements HeaderInterceptorConfigService {
  readonly httpClient = inject(HttpClient);
  private document = inject(DOCUMENT);

  private wid!: string;

  /**
   * Gets the WID header value, either from cache or by fetching from the API.
   *
   * @returns Observable that emits the WID string
   */
  getHeaderValue(): Observable<string> {
    if (this.wid) {
      return of(this.wid);
    } else {
      const url = (this.document.defaultView as unknown as ParticipantWindow)
        ?.apis?.participantWid;
      return this.httpClient.get<{ wid: string }>(url).pipe(
        map((response) => {
          this.wid = response.wid;
          return this.wid;
        }),
      );
    }
  }

  /**
   * Determines whether the interceptor should add the WID header to a given request.
   *
   * @param req - The HTTP request to evaluate
   * @returns true if the request URL contains '/participants/participant-id'
   */
  public shouldIntercept(req: HttpRequest<unknown>): boolean {
    if (/\/participants\/participant-id/.exec(req.url)) {
      return true;
    }
    return false;
  }
}
