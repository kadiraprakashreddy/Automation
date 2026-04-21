/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { widInterceptorFactory } from '@fmr-ap123285/angular-utils';
import { WidInterceptorConfigService } from './services/wid-interceptor-config/wid-interceptor-config.service';

/**
 * Provides the WID (Workload ID) HTTP interceptor configuration.
 *
 * This provider function encapsulates the HTTP_INTERCEPTORS setup for injecting
 * WID headers into specific HTTP requests. It uses the widInterceptorFactory
 * from @fmr-ap123285/angular-utils along with WidInterceptorConfigService.
 *
 * @example
 * ```typescript
 * // In app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(withInterceptorsFromDi()),
 *     provideWidInterceptor(),
 *   ],
 * };
 * ```
 *
 * @returns Provider configuration for the WID interceptor
 */
export const provideWidInterceptor = () => {
  return [
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: widInterceptorFactory,
      multi: true,
      deps: [WidInterceptorConfigService],
    },
  ];
};
