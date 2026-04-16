import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { WidInterceptorConfigService } from './wid-interceptor-config.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpRequest, provideHttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

describe('WidInterceptorConfigService', () => {
  let spectator: SpectatorService<WidInterceptorConfigService>;
  let httpMock: HttpTestingController;

  const url = '/test-wid';
  const doc = { defaultView: { apis: { participantWid: url } } } as unknown;

  const createService = createServiceFactory({
    service: WidInterceptorConfigService,
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: DOCUMENT, useValue: doc },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches wid when not cached and caches it', (done) => {
    spectator.service.getHeaderValue().subscribe((v) => {
      expect(v).toBe('WID1');

      // subsequent call should return cached value without network
      spectator.service.getHeaderValue().subscribe((v2) => {
        expect(v2).toBe('WID1');
        done();
      });
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({ wid: 'WID1' });
  });

  it('returns true for participant-id URL', () => {
    const mockReq = {
      url: '/api/participants/participant-id/123',
    } as HttpRequest<unknown>;

    expect(spectator.service.shouldIntercept(mockReq)).toBe(true);
  });

  it('returns false for non-participant-id URL', () => {
    const mockReq = {
      url: '/api/other/endpoint',
    } as HttpRequest<unknown>;

    expect(spectator.service.shouldIntercept(mockReq)).toBe(false);
  });
});
