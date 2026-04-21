/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { xsrfInterceptorFactory } from '@fmr-ap123285/angular-utils';
import { AppXsrfInterceptorConfigService } from './services/app-xsrf-interceptor-config/app-xsrf-interceptor-config.service';

/**
 * Provides the XSRF (Cross-Site Request Forgery) HTTP interceptor configuration.
 *
 * This provider function encapsulates the HTTP_INTERCEPTORS setup for injecting
 * XSRF token headers into specific HTTP requests. It uses the xsrfInterceptorFactory
 * from @fmr-ap123285/angular-utils along with AppXsrfInterceptorConfigService.
 *
 * @remarks
 * The interceptor adds XSRF protection to requests targeting `/sps-terminations`
 * and `/gosps` endpoints by including the transaction token in the request headers.
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(withInterceptorsFromDi()),
 *     provideAppXsrfInterceptor(),
 *   ],
 * };
 * ```
 *
 * @example
 * ```typescript
 * // In app.module.ts
 * @NgModule({
 *   providers: [
 *     provideHttpClient(withInterceptorsFromDi()),
 *     provideAppXsrfInterceptor(),
 *   ],
 * })
 * export class AppModule {}
 * ```
 *
 * @returns Provider configuration for the XSRF interceptor
 *
 * @see {@link AppXsrfInterceptorConfigService} Configuration service for XSRF token handling
 * @see {@link xsrfInterceptorFactory} Factory from angular-utils
 */
export const provideAppXsrfInterceptor = () => {
  return [
    AppXsrfInterceptorConfigService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: xsrfInterceptorFactory,
      multi: true,
      deps: [AppXsrfInterceptorConfigService],
    },
  ];
};
