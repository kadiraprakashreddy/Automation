/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file Unit tests for term-rule-ids.service.ts
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import {
  SpectatorService,
  createServiceFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import { SDLContentService } from '../sdl-content/sdl-content.service';
import { TermRuleIdsService } from './term-rule-ids.service';
import { TermRuleIdsModel } from '../../models/term-rule-ids.model';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ISDLResourceBundle } from '../../models/sdl-resource-bundle.model';

describe('TermRuleIdsService', () => {
  let spectator: SpectatorService<TermRuleIdsService>;
  let http: HttpClient;
  let windowService: FdWindowService;
  let sdlContentService: SDLContentService;
  const createService = createServiceFactory({
    service: TermRuleIdsService,
    providers: [
      mockProvider(HttpClient),
      mockProvider(FdWindowService),
      mockProvider(SDLContentService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    http = spectator.inject(HttpClient);
    windowService = spectator.inject(FdWindowService);
    sdlContentService = spectator.inject(SDLContentService);

    // Mock window
    windowService.getWindow = jest.fn().mockReturnValue({
      apis: { termRuleIds: 'http://test.com/term-rule-ids' },
    });

    // Mock SDL content
    sdlContentService.resourceBundles = {
      messages: { serviceErrorTitle: 'Error', serviceErrorBody: 'Body' },
    } as unknown as ISDLResourceBundle;
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should fetch term rule IDs successfully', async () => {
    const mockData: TermRuleIdsModel = {
      terminationRuleIds: ['1', '2'],
      grkClient: false,
    };
    http.get = jest.fn().mockReturnValue(of(mockData));

    const result = spectator.service.fetchTermRuleIds();

    await expect(firstValueFrom(result)).resolves.toEqual(mockData);
    expect(http.get).toHaveBeenCalledWith('http://test.com/term-rule-ids');
    expect(spectator.service.termRuleIdsModel).toEqual(mockData);
  });

  it('should handle HTTP error', async () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
    });
    http.get = jest.fn().mockReturnValue(throwError(() => error));

    const result = spectator.service.fetchTermRuleIds();

    await expect(firstValueFrom(result)).rejects.toBeDefined();
  });

  it('should handle missing termRuleIds URL', async () => {
    windowService.getWindow = jest.fn().mockReturnValue({ apis: {} });

    const result = spectator.service.fetchTermRuleIds();

    await expect(firstValueFrom(result)).rejects.toBeDefined();
  });

  it('should handle error when resourceBundles is null', async () => {
    sdlContentService.resourceBundles = null;
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
    });
    http.get = jest.fn().mockReturnValue(throwError(() => error));

    const result = spectator.service.fetchTermRuleIds();

    await expect(firstValueFrom(result)).rejects.toBeDefined();
  });
});
