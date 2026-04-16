/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file Unit tests for participant-ui.service.ts
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import {
  SpectatorService,
  createServiceFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import { ParticipantUI } from './participant-ui.service';
import { EmploymentDetailsModel } from '../../models/employment-details.model';

describe('ParticipantUI', () => {
  let spectator: SpectatorService<ParticipantUI>;
  let windowService: FdWindowService;
  const createService = createServiceFactory({
    service: ParticipantUI,
    providers: [mockProvider(FdWindowService)],
  });

  beforeEach(() => {
    spectator = createService();
    windowService = spectator.inject(FdWindowService);
    jest.mocked(windowService.getWindow).mockReturnValue({
      apis: {
        content: 'https://content.api',
        termModelContent: 'https://term-model.api',
      },
    });
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should set shouldDisplayTermModels to true and contentURI to termModelContent when terminationDate is future and updateSuccess is false', () => {
    const mockModel: Partial<EmploymentDetailsModel> = {
      terminationDetails: {
        terminationDate: '2026-12-31',
        terminationId: '',
        terminationReversalIndicator: '',
        activeRuleIndicator: '',
      },
    };

    spectator.service.setUIBehavior(mockModel as EmploymentDetailsModel, false);

    expect(spectator.service.shouldDisplayTermModels).toBe(true);
    expect(spectator.service.contentURI).toBe('https://term-model.api');
  });

  it('should set shouldDisplayTermModels to false and contentURI to content when updateSuccess is true', () => {
    const mockModel: Partial<EmploymentDetailsModel> = {
      terminationDetails: {
        terminationDate: '2026-12-31',
        terminationId: '',
        terminationReversalIndicator: '',
        activeRuleIndicator: '',
      },
    };

    spectator.service.setUIBehavior(mockModel as EmploymentDetailsModel, true);

    expect(spectator.service.shouldDisplayTermModels).toBe(false);
    expect(spectator.service.contentURI).toBe('https://content.api');
  });

  it('should set shouldDisplayTermModels to false and contentURI to content when terminationDate is past', () => {
    const mockModel: Partial<EmploymentDetailsModel> = {
      terminationDetails: {
        terminationDate: '2020-01-01',
        terminationId: '',
        terminationReversalIndicator: '',
        activeRuleIndicator: '',
      },
    };

    spectator.service.setUIBehavior(mockModel as EmploymentDetailsModel, false);

    expect(spectator.service.shouldDisplayTermModels).toBe(false);
    expect(spectator.service.contentURI).toBe('https://content.api');
  });

  it('should set shouldDisplayTermModels to true and contentURI to termModelContent when terminationDate is null', () => {
    const mockModel: Partial<EmploymentDetailsModel> = {
      terminationDetails: {
        terminationDate: null,
        terminationId: '',
        terminationReversalIndicator: '',
        activeRuleIndicator: '',
      },
    };

    spectator.service.setUIBehavior(mockModel as EmploymentDetailsModel, false);

    expect(spectator.service.shouldDisplayTermModels).toBe(true);
    expect(spectator.service.contentURI).toBe('https://term-model.api');
  });

  it('should set shouldDisplayTermModels to true and contentURI to termModelContent when terminationDate is undefined', () => {
    const mockModel: Partial<EmploymentDetailsModel> = {
      terminationDetails: {
        terminationDate: undefined,
        terminationId: '',
        terminationReversalIndicator: '',
        activeRuleIndicator: '',
      },
    };

    spectator.service.setUIBehavior(mockModel as EmploymentDetailsModel, false);

    expect(spectator.service.shouldDisplayTermModels).toBe(true);
    expect(spectator.service.contentURI).toBe('https://term-model.api');
  });

  it('should set shouldDisplayTermModels to true and contentURI to termModelContent when terminationDate is empty string', () => {
    const mockModel: Partial<EmploymentDetailsModel> = {
      terminationDetails: {
        terminationDate: '',
        terminationId: '',
        terminationReversalIndicator: '',
        activeRuleIndicator: '',
      },
    };

    spectator.service.setUIBehavior(mockModel as EmploymentDetailsModel, false);

    expect(spectator.service.shouldDisplayTermModels).toBe(true);
    expect(spectator.service.contentURI).toBe('https://term-model.api');
  });
});
