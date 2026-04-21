import { HttpRequest } from '@angular/common/http';
import { DOCUMENT } from '@angular/core';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { AppXsrfInterceptorConfigService } from './app-xsrf-interceptor-config.service';

describe('AppXsrfInterceptorConfigService', () => {
  let spectator: SpectatorService<AppXsrfInterceptorConfigService>;

  describe('with txntoken in window', () => {
    const mockDocument = {
      defaultView: {
        txntoken: 'test-token-123',
      },
    } as unknown as Document;

    const createService = createServiceFactory({
      service: AppXsrfInterceptorConfigService,
      providers: [{ provide: DOCUMENT, useValue: mockDocument }],
    });

    beforeEach(() => {
      spectator = createService();
    });

    it('should create the service', () => {
      expect(spectator.service).toBeTruthy();
    });

    describe('getTokenValue', () => {
      it('should return the txntoken from window', () => {
        const token = spectator.service.getTokenValue();
        expect(token).toBe('test-token-123');
      });
    });
  });

  describe('without txntoken in window', () => {
    const mockDocument = {
      defaultView: {},
    } as unknown as Document;

    const createService = createServiceFactory({
      service: AppXsrfInterceptorConfigService,
      providers: [{ provide: DOCUMENT, useValue: mockDocument }],
    });

    beforeEach(() => {
      spectator = createService();
    });

    describe('getTokenValue', () => {
      it('should return empty string when txntoken is not present', () => {
        const token = spectator.service.getTokenValue();
        expect(token).toBe('');
      });
    });
  });

  describe('with null defaultView', () => {
    const mockDocument = {
      defaultView: null,
    } as unknown as Document;

    const createService = createServiceFactory({
      service: AppXsrfInterceptorConfigService,
      providers: [{ provide: DOCUMENT, useValue: mockDocument }],
    });

    beforeEach(() => {
      spectator = createService();
    });

    describe('getTokenValue', () => {
      it('should return empty string when defaultView is null', () => {
        const token = spectator.service.getTokenValue();
        expect(token).toBe('');
      });
    });
  });

  describe('isRequestInTxn', () => {
    const mockDocument = {
      defaultView: { txntoken: 'test-token' },
    } as unknown as Document;

    const createService = createServiceFactory({
      service: AppXsrfInterceptorConfigService,
      providers: [{ provide: DOCUMENT, useValue: mockDocument }],
    });

    beforeEach(() => {
      spectator = createService();
    });

    it('should return true for request containing /sps-terminations in URL', () => {
      const request = {
        url: '/api/sps-terminations/data',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(true);
    });

    it('should return true for request containing /gosps in URL', () => {
      const request = {
        url: '/api/gosps/data',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(true);
    });

    it('should return true for request containing both /sps-terminations and /gosps in URL', () => {
      const request = {
        url: '/api/sps-terminations/gosps/data',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(true);
    });

    it('should return false for request not containing /sps-terminations or /gosps in URL', () => {
      const request = {
        url: '/api/other/endpoint',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(false);
    });

    it('should return false for request with empty URL', () => {
      const request = {
        url: '',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(false);
    });

    it('should return true for GET request to /sps-terminations', () => {
      const request = {
        url: '/api/sps-terminations/data',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(true);
    });

    it('should return false for PUT request to other endpoint', () => {
      const request = {
        url: '/api/users/123',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(false);
    });

    it('should handle URL with query parameters containing /sps-terminations', () => {
      const request = {
        url: '/api/sps-terminations?param=value',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(true);
    });

    it('should handle URL with query parameters containing /gosps', () => {
      const request = {
        url: '/api/gosps?param=value',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(true);
    });

    it('should be case-sensitive and not match /SPS-TERMINATIONS', () => {
      const request = {
        url: '/api/SPS-TERMINATIONS/data',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(false);
    });

    it('should match /sps-terminations anywhere in the URL path', () => {
      const request = {
        url: '/v1/api/sps-terminations/resource',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(true);
    });

    it('should match /gosps anywhere in the URL path', () => {
      const request = {
        url: '/v1/api/gosps/resource',
      } as HttpRequest<unknown>;
      expect(spectator.service.isRequestInTxn(request)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    const mockDocument = {
      defaultView: {
        txntoken: 'integration-token-xyz',
      },
    } as unknown as Document;

    const createService = createServiceFactory({
      service: AppXsrfInterceptorConfigService,
      providers: [{ provide: DOCUMENT, useValue: mockDocument }],
    });

    beforeEach(() => {
      spectator = createService();
    });

    it('should correctly identify XSRF-protected requests and provide token', () => {
      const request = {
        url: '/api/sps-terminations/submit',
      } as HttpRequest<unknown>;
      const shouldIntercept = spectator.service.isRequestInTxn(request);
      const token = spectator.service.getTokenValue();

      expect(shouldIntercept).toBe(true);
      expect(token).toBe('integration-token-xyz');
    });

    it('should correctly identify non-XSRF-protected requests but still provide token', () => {
      const request = {
        url: '/api/other/endpoint',
      } as HttpRequest<unknown>;
      const shouldIntercept = spectator.service.isRequestInTxn(request);
      const token = spectator.service.getTokenValue();

      expect(shouldIntercept).toBe(false);
      expect(token).toBe('integration-token-xyz');
    });
  });
});
