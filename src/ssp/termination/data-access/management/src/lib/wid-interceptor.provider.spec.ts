/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideWidInterceptor } from './wid-interceptor.provider';
import { widInterceptorFactory } from '@fmr-ap123285/angular-utils';
import { WidInterceptorConfigService } from './services/wid-interceptor-config/wid-interceptor-config.service';

class DummyService {}

const createService = createServiceFactory({
  service: DummyService,
  providers: provideWidInterceptor(),
});

describe('provideWidInterceptor', () => {
  it('returns an array with a properly shaped HTTP_INTERCEPTORS provider', () => {
    const providers = provideWidInterceptor();
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBeGreaterThan(0);

    const p: any = providers[0];
    expect(p.provide).toBe(HTTP_INTERCEPTORS);
    expect(p.useFactory).toBe(widInterceptorFactory);
    expect(p.multi).toBe(true);
    expect(Array.isArray(p.deps)).toBe(true);
    expect(p.deps).toEqual([WidInterceptorConfigService]);
  });

  it('can be registered as providers in an Angular test module (Spectator)', () => {
    const spectator: SpectatorService<DummyService> = createService();
    expect(spectator).toBeTruthy();

    const registered = provideWidInterceptor()[0] as any;
    expect(registered.provide).toBe(HTTP_INTERCEPTORS);
  });
});
