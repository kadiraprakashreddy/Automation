/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FciHeaderStatusInterceptor } from '@fmr-ap123285/angular-utils';

/**
 * Provides the FCI header status HTTP interceptor configuration.
 *
 * Throws HttpErrorResponse if `fid-ws-http-status` header
 * is present and is < 200 or > 299.
 */
export const provideFciHeaderStatusInterceptor = () => {
  return [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FciHeaderStatusInterceptor,
      multi: true,
    },
  ];
};
