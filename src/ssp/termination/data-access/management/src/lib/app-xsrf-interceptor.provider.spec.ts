/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAppXsrfInterceptor } from './app-xsrf-interceptor.provider';
import { xsrfInterceptorFactory } from '@fmr-ap123285/angular-utils';
import { AppXsrfInterceptorConfigService } from './services/app-xsrf-interceptor-config/app-xsrf-interceptor-config.service';

class DummyService {}

const createService = createServiceFactory({
  service: DummyService,
  providers: provideAppXsrfInterceptor(),
});

describe('provideAppXsrfInterceptor', () => {
  it('returns an array with service and HTTP_INTERCEPTORS provider', () => {
    const providers = provideAppXsrfInterceptor();
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBe(2);

    // First provider should be the service
    expect(providers[0]).toBe(AppXsrfInterceptorConfigService);

    // Second provider should be the HTTP_INTERCEPTORS configuration
    const interceptorConfig: any = providers[1];
    expect(interceptorConfig.provide).toBe(HTTP_INTERCEPTORS);
    expect(interceptorConfig.useFactory).toBe(xsrfInterceptorFactory);
    expect(interceptorConfig.multi).toBe(true);
    expect(Array.isArray(interceptorConfig.deps)).toBe(true);
    expect(interceptorConfig.deps).toEqual([AppXsrfInterceptorConfigService]);
  });

  it('can be registered as providers in an Angular test module (Spectator)', () => {
    const spectator: SpectatorService<DummyService> = createService();
    expect(spectator).toBeTruthy();

    const providers = provideAppXsrfInterceptor();
    const interceptorConfig = providers[1] as any;
    expect(interceptorConfig.provide).toBe(HTTP_INTERCEPTORS);
  });
});
