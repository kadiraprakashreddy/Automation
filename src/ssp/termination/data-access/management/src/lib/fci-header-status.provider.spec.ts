/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FciHeaderStatusInterceptor } from '@fmr-ap123285/angular-utils';
import { provideFciHeaderStatusInterceptor } from './fci-header-status.provider';

class DummyService {}

const createService = createServiceFactory({
  service: DummyService,
  providers: provideFciHeaderStatusInterceptor(),
});

describe('provideFciHeaderStatusInterceptor', () => {
  it('returns an array with a properly shaped HTTP_INTERCEPTORS provider', () => {
    const providers = provideFciHeaderStatusInterceptor();
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBeGreaterThan(0);

    const p: any = providers[0];
    expect(p.provide).toBe(HTTP_INTERCEPTORS);
    expect(p.useClass).toBe(FciHeaderStatusInterceptor);
    expect(p.multi).toBe(true);
  });

  it('can be registered as providers in an Angular test module (Spectator)', () => {
    const spectator: SpectatorService<DummyService> = createService();
    expect(spectator).toBeTruthy();

    const registered = provideFciHeaderStatusInterceptor()[0] as any;
    expect(registered.provide).toBe(HTTP_INTERCEPTORS);
  });
});
