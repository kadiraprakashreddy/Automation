/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file Unit tests for sdl-content.service.ts
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import {
  SpectatorService,
  createServiceFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import { ParticipantUI } from '../participant-ui/participant-ui.service';
import { SDLContentService } from './sdl-content.service';
import { ISDLContent } from '../../models/sdl-resource-bundle.model';
import { firstValueFrom, of, throwError } from 'rxjs';

describe('SDLContentService', () => {
  let spectator: SpectatorService<SDLContentService>;
  let http: HttpClient;
  let windowService: FdWindowService;
  let participantUI: ParticipantUI;
  const createService = createServiceFactory({
    service: SDLContentService,
    providers: [
      mockProvider(HttpClient),
      mockProvider(FdWindowService),
      mockProvider(ParticipantUI),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    http = spectator.inject(HttpClient);
    windowService = spectator.inject(FdWindowService);
    participantUI = spectator.inject(ParticipantUI);

    // Mock window
    windowService.getWindow = jest.fn().mockReturnValue({
      apis: { termModelContent: 'http://window.com/content' },
    });

    // Mock participantUI
    participantUI.contentURI = 'http://participant.com/content';
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should fetch SDL content successfully using participantUI contentURI', async () => {
    const mockResponse = {
      content: { resourceBundles: { messages: {} } } as ISDLContent,
    };
    http.get = jest.fn().mockReturnValue(of(mockResponse));

    const result = spectator.service.fetchSDLContent();

    await expect(firstValueFrom(result)).resolves.toEqual(mockResponse.content);
    expect(http.get).toHaveBeenCalledWith('http://participant.com/content');
    expect(spectator.service.content).toEqual(mockResponse.content);
    expect(spectator.service.resourceBundles).toEqual(
      mockResponse.content.resourceBundles,
    );
  });

  it('should fetch SDL content successfully using window URL when participantUI contentURI is null', async () => {
    participantUI.contentURI = null;
    const mockResponse = {
      content: { resourceBundles: { messages: {} } } as ISDLContent,
    };
    http.get = jest.fn().mockReturnValue(of(mockResponse));

    const result = spectator.service.fetchSDLContent();

    await expect(firstValueFrom(result)).resolves.toEqual(mockResponse.content);
    expect(http.get).toHaveBeenCalledWith('http://window.com/content');
  });

  it('should handle HTTP error', async () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
    });
    http.get = jest.fn().mockReturnValue(throwError(() => error));

    const result = spectator.service.fetchSDLContent();

    await expect(firstValueFrom(result)).rejects.toBeDefined();
  });

  it('should handle missing content URL', async () => {
    participantUI.contentURI = null;
    windowService.getWindow = jest.fn().mockReturnValue({ apis: {} });

    const result = spectator.service.fetchSDLContent();

    await expect(firstValueFrom(result)).rejects.toBeDefined();
  });

  it('should handle empty response without resourceBundles', async () => {
    const mockResponse = { content: {} as ISDLContent };
    http.get = jest.fn().mockReturnValue(of(mockResponse));

    const result = spectator.service.fetchSDLContent();

    await expect(firstValueFrom(result)).rejects.toBeDefined();
  });
});
