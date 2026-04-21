/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { HttpRequest } from '@angular/common/http';
import { DOCUMENT, Injectable, inject } from '@angular/core';
import { XsrfInterceptorConfigService } from '@fmr-ap123285/angular-utils';

/**
 * Custom XSRF interceptor configuration service for SPS termination applications.
 *
 * This service extends the base `XsrfInterceptorConfigService` to provide
 * SPS-specific XSRF token handling for HTTP requests. It retrieves the transaction
 * token from the window object and determines which requests require XSRF protection
 * based on URL patterns.
 *
 * @remarks
 * The service checks for requests to `/sps-terminations` and `/gosps` endpoints
 * to determine if XSRF protection should be applied.
 *
 * @see {@link XsrfInterceptorConfigService} Base class from angular-utils
 */
@Injectable()
export class AppXsrfInterceptorConfigService extends XsrfInterceptorConfigService {
  private readonly document = inject(DOCUMENT);

  /**
   * Retrieves the XSRF token value from the document's window object.
   *
   * @returns The transaction token (`txntoken`) from the window object,
   *          or an empty string if not present.
   */
  public override getTokenValue(): string {
    const windowObj = this.document.defaultView as { txntoken?: string } | null;
    const token = windowObj?.txntoken ?? '';
    return token;
  }

  /**
   * Determines whether an HTTP request requires XSRF protection.
   *
   * @param req - The HTTP request to evaluate
   * @returns `true` if the request URL contains `/sps-terminations` or `/gosps`,
   *          `false` otherwise.
   */
  public override isRequestInTxn(req: HttpRequest<unknown>): boolean {
    const url = req.url;
    const isTerminationRequest = url?.includes('/sps-terminations') ?? false;
    const isGospsRequest = url?.includes('/gosps') ?? false;
    const result = isTerminationRequest || isGospsRequest;
    return result;
  }
}
