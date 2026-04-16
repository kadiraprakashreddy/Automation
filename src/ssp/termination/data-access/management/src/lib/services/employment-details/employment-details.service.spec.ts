/* eslint-disable @typescript-eslint/no-explicit-any */
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { EmploymentDetailsService } from './employment-details.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { EmploymentDetailsModel } from '../../models/employment-details.model';

describe('EmploymentDetailsService', () => {
  let spectator: SpectatorService<EmploymentDetailsService>;
  let httpMock: HttpTestingController;

  const url = '/emp-details';

  const createService = createServiceFactory({
    service: EmploymentDetailsService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    // ensure jsdom window has the configured url for each test by default
    (global as any).window = (global as any).window || {};
    (global as any).window.apis = { employmentdetails: url };
    spectator = createService();
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    // cleanup any modifications to the global window
    try {
      delete (global as any).window.apis;
    } catch {
      /* empty */
    }
    httpMock.verify();
  });

  it('returns body when endpoint responds successfully', (done) => {
    const mock: EmploymentDetailsModel = { employerName: 'ACME' } as any;

    spectator.service.fetchEmployeeDetails().subscribe((res) => {
      expect(res).toEqual(mock);
      done();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mock, { status: 200, statusText: 'OK' });
  });

  it('throws HttpErrorResponse when employmentDetailsUrl is missing', (done) => {
    // remove the configured url for this test
    (global as any).window.apis = {};

    spectator.service.fetchEmployeeDetails().subscribe({
      next: () => {
        throw new Error('should not emit next');
      },
      error: (err) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
        done();
      },
    });
    // no HTTP requests expected from this instance; the error handler above completes the test
  });

  it('propagates HttpErrorResponse from HTTP failure', (done) => {
    spectator.service.fetchEmployeeDetails().subscribe({
      next: () => {
        throw new Error('should not emit next');
      },
      error: (err: HttpErrorResponse) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
        expect(err.status).toBe(500);
        done();
      },
    });

    const req = httpMock.expectOne(url);
    req.flush(null, { status: 500, statusText: 'Server Error' });
  });

  it('treats API errors envelope in 200 response as HttpErrorResponse', (done) => {
    const apiErrorPayload = {
      errors: [
        {
          code: 'F-WSDPER-SPTERM-000403',
          title: 'ZFS 24 15:37:59',
          detail: 'Authorization check failed for this request.',
          parameters: null,
          links: null,
          source: null,
          status: null,
        },
      ],
    };

    spectator.service.fetchEmployeeDetails().subscribe({
      next: () => {
        throw new Error('should not emit next');
      },
      error: (err: HttpErrorResponse) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
        expect(err.status).toBe(0);
        expect(err.error).toEqual(apiErrorPayload);
        done();
      },
    });

    const req = httpMock.expectOne(url);
    req.flush(apiErrorPayload, { status: 200, statusText: 'OK' });
  });

  it('sendErrorEvent wraps non-HttpError into HttpErrorResponse', (done) => {
    const err$ = (spectator.service as any).sendErrorEvent(new Error('boom'));
    err$.subscribe({
      next: () => {
        throw new Error('should not emit next');
      },
      error: (err: HttpErrorResponse) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
        expect(err.status).toBe(0);
        expect(String(err.error)).toContain('boom');
        done();
      },
    });
  });

  it('sendErrorEvent rethrows HttpErrorResponse unchanged', (done) => {
    const httpErr = new HttpErrorResponse({
      status: 418,
      statusText: "I'm a teapot",
      error: 'teapot-error',
    });

    const err$ = (spectator.service as any).sendErrorEvent(httpErr);
    err$.subscribe({
      next: () => {
        throw new Error('should not emit next');
      },
      error: (err: HttpErrorResponse) => {
        expect(err).toBe(httpErr);
        done();
      },
    });
  });
});
