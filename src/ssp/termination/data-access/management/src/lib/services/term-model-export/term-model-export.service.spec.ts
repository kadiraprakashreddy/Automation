/**
 * @copyright 2026, FMR LLC
 * @file Unit tests for term-model-export.service.ts
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SpectatorService,
  createServiceFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { SDLContentService } from '../sdl-content/sdl-content.service';
import { AnalyticsUtilService } from '../analytics-util.service';
import { TermModelExportService } from './term-model-export.service';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ISDLResourceBundle } from '../../models/sdl-resource-bundle.model';
import { ErrorHandlingUtils } from '../../utilities/error-handling-utils';

describe('TermModelExportService', () => {
  let spectator: SpectatorService<TermModelExportService>;
  let http: HttpClient;
  let sdlContentService: SDLContentService;
  let analyticsService: AnalyticsUtilService;
  const createService = createServiceFactory({
    service: TermModelExportService,
    providers: [
      mockProvider(HttpClient),
      mockProvider(SDLContentService),
      mockProvider(AnalyticsUtilService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    http = spectator.inject(HttpClient);
    sdlContentService = spectator.inject(SDLContentService);
    analyticsService = spectator.inject(AnalyticsUtilService);

    jest.useFakeTimers();

    // Mock SDL content
    sdlContentService.resourceBundles = {
      exportReport: { reportFileName: 'test-report' },
      messages: { serviceErrorTitle: 'Error', serviceErrorBody: 'Body' },
    } as unknown as ISDLResourceBundle;

    // Mock analytics
    analyticsService.pageActionSubmitAnalytics = jest.fn();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should return error observable when termModelUrl is null', async () => {
    const result = spectator.service.fetchExportTermModels(
      null,
      null,
      null,
      undefined,
    );

    await expect(firstValueFrom(result)).rejects.toBeDefined();
  });

  it('should return error observable when termModelUrl is undefined', async () => {
    const result = spectator.service.fetchExportTermModels(
      undefined,
      null,
      null,
      undefined,
    );

    await expect(firstValueFrom(result)).rejects.toBeDefined();
  });

  it('should make HTTP request and handle success', async () => {
    const mockBlob = new Blob(['test'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const mockResponse = new HttpResponse({
      body: mockBlob,
      headers: new HttpHeaders({
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    });
    http.get = jest.fn().mockReturnValue(of(mockResponse));

    // Mock document
    const mockLink = { click: jest.fn(), download: '', href: '' };
    globalThis.document.createElement = jest.fn().mockReturnValue(mockLink);
    const MockFileReader = jest.fn().mockImplementation(() => ({
      readAsDataURL: jest.fn(function () {
        this.result =
          'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,test';
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }),
      onload: null,
    }));
    (MockFileReader as any).EMPTY = 0;
    (MockFileReader as any).LOADING = 1;
    (MockFileReader as any).DONE = 2;
    globalThis.FileReader = MockFileReader as any;

    const result = spectator.service.fetchExportTermModels(
      'http://test.com',
      null,
      null,
      undefined,
    );

    await expect(firstValueFrom(result)).resolves.toBeUndefined();
    jest.runOnlyPendingTimers();
    expect(http.get).toHaveBeenCalledWith(
      'http://test.com/report?termId=null&termDate=null&esppIndicator=N',
      { responseType: 'blob', observe: 'response' },
    );
    expect(analyticsService.pageActionSubmitAnalytics).toHaveBeenCalled();
    expect(mockLink.click).toHaveBeenCalled();
    expect(mockLink.download).toBe('test-report.xlsx');
    expect(mockLink.href).toBe(
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,test',
    );
  });

  it('should construct correct API URL with termDate', async () => {
    const mockBlob = new Blob(['test'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const mockResponse = new HttpResponse({
      body: mockBlob,
      headers: new HttpHeaders({
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    });
    http.get = jest.fn().mockReturnValue(of(mockResponse));

    // Mock document
    const mockLink = { click: jest.fn(), download: '', href: '' };
    globalThis.document.createElement = jest.fn().mockReturnValue(mockLink);
    const MockFileReader = jest.fn().mockImplementation(() => ({
      readAsDataURL: jest.fn(function () {
        this.result =
          'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,test';
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }),
      onload: null,
    }));
    (MockFileReader as any).EMPTY = 0;
    (MockFileReader as any).LOADING = 1;
    (MockFileReader as any).DONE = 2;
    globalThis.FileReader = MockFileReader as any;

    await firstValueFrom(
      spectator.service.fetchExportTermModels(
        'http://test.com',
        '2023-01-01',
        '123',
        true,
      ),
    );

    expect(http.get).toHaveBeenCalledWith(
      'http://test.com/report?termId=123&termDate=2023-01-01&esppIndicator=Y',
      { responseType: 'blob', observe: 'response' },
    );
  });

  it('should construct correct API URL with esppIndicator false', async () => {
    const mockBlob = new Blob(['test'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const mockResponse = new HttpResponse({
      body: mockBlob,
      headers: new HttpHeaders({
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    });
    http.get = jest.fn().mockReturnValue(of(mockResponse));

    // Mock document
    const mockLink = { click: jest.fn(), download: '', href: '' };
    globalThis.document.createElement = jest.fn().mockReturnValue(mockLink);
    const MockFileReader = jest.fn().mockImplementation(() => ({
      readAsDataURL: jest.fn(function () {
        this.result =
          'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,test';
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }),
      onload: null,
    }));
    (MockFileReader as any).EMPTY = 0;
    (MockFileReader as any).LOADING = 1;
    (MockFileReader as any).DONE = 2;
    globalThis.FileReader = MockFileReader as any;

    await firstValueFrom(
      spectator.service.fetchExportTermModels(
        'http://test.com',
        '2023-01-01',
        '123',
        false,
      ),
    );

    expect(http.get).toHaveBeenCalledWith(
      'http://test.com/report?termId=123&termDate=2023-01-01&esppIndicator=N',
      { responseType: 'blob', observe: 'response' },
    );
  });

  it('should construct correct API URL without termDate', async () => {
    const mockBlob = new Blob(['test'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const mockResponse = new HttpResponse({
      body: mockBlob,
      headers: new HttpHeaders({
        'content-type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),
    });
    http.get = jest.fn().mockReturnValue(of(mockResponse));

    // Mock document
    const mockLink = { click: jest.fn(), download: '', href: '' };
    globalThis.document.createElement = jest.fn().mockReturnValue(mockLink);
    const MockFileReader = jest.fn().mockImplementation(() => ({
      readAsDataURL: jest.fn(function () {
        this.result =
          'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,test';
        setTimeout(() => {
          if (this.onload) {
            this.onload();
          }
        }, 0);
      }),
      onload: null,
    }));
    (MockFileReader as any).EMPTY = 0;
    (MockFileReader as any).LOADING = 1;
    (MockFileReader as any).DONE = 2;
    globalThis.FileReader = MockFileReader as any;

    await firstValueFrom(
      spectator.service.fetchExportTermModels(
        'http://test.com',
        null,
        null,
        undefined,
      ),
    );

    expect(http.get).toHaveBeenCalledWith(
      'http://test.com/report?termId=null&termDate=null&esppIndicator=N',
      { responseType: 'blob', observe: 'response' },
    );
  });

  it('should handle HTTP error', async () => {
    const error = new Error('HTTP Error');
    http.get = jest.fn().mockReturnValue(throwError(() => error));

    const result = spectator.service.fetchExportTermModels(
      'http://test.com',
      null,
      null,
      undefined,
    );

    await expect(firstValueFrom(result)).rejects.toThrow();
  });

  it('should handle HTTP error with application/json type', async () => {
    const error = new HttpErrorResponse({
      error: { type: 'application/json', text: '{}' },
      status: 500,
      statusText: 'Server Error',
      url: 'http://test.com/report',
    });
    http.get = jest.fn().mockReturnValue(throwError(() => error));

    const result = spectator.service.fetchExportTermModels(
      'http://test.com',
      null,
      null,
      undefined,
    );

    await expect(firstValueFrom(result)).rejects.toThrow();
  });

  it('should call getErrorMessage without bundles when resourceBundles is null', async () => {
    // emulate missing bundles and call sendErrorEvent directly (private method)
    (sdlContentService as any).resourceBundles = null;
    const spy = jest.spyOn(ErrorHandlingUtils, 'getErrorMessage');

    // call private method directly and assert it throws
    await expect(
      firstValueFrom((spectator.service as any).sendErrorEvent()),
    ).rejects.toBeDefined();

    expect(spy).toHaveBeenCalled();
  });

  it('should call sendErrorEvent branch when error is non-json', async () => {
    const error = new HttpErrorResponse({
      error: { type: 'text/html' },
      status: 500,
    });
    http.get = jest.fn().mockReturnValue(throwError(() => error));

    const spy = jest.spyOn(ErrorHandlingUtils, 'getErrorMessage');

    const result = spectator.service.fetchExportTermModels(
      'http://test.com',
      null,
      null,
      undefined,
    );
    await expect(firstValueFrom(result)).rejects.toBeDefined();
    // sendErrorEvent was invoked without passing the original error, so getErrorMessage called with undefined and bundle args
    expect(spy).toHaveBeenCalled();
  });
});
