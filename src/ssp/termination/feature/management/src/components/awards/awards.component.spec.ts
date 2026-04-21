/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { ChangeDetectorRef } from '@angular/core';
import { FdWindowService } from '@fmr-ap123285/angular-utils';

import { SpsTerminationFeatureManagementAwardsComponent } from './awards.component';
import {
  EmploymentDetailsService,
  FetchTermModelsService,
  ManagementStore,
  SDLContentService,
  TermModelConstant,
  UtilityService,
} from '@fmr-ap160368/sps-termination-data-access-management';

describe('SpsTerminationFeatureManagementAwardsComponent (unit)', () => {
  let spectator: Spectator<SpsTerminationFeatureManagementAwardsComponent>;

  const mockTermModels = {
    noGrants: false,
    divisionalRestricted: true,
    partialDivisionalRestricted: false,
    plans: [{ id: 1 }, { id: 2 }],
    // provide a modeledDate used in template (awards.modeledDate.replace(...))
    modeledDate: '2024-02-03T12:00:00Z',
  } as any;

  const mockStore = {
    isLoading: jest.fn().mockReturnValue(false),
    exportInProgress: jest.fn().mockReturnValue(false),
    csvExportError: jest.fn().mockReturnValue(null),
    hasTermModels: jest.fn().mockReturnValue(true),
    termModels: jest.fn().mockReturnValue(mockTermModels),
    getLink: jest.fn().mockReturnValue('http://term-model'),
    exportTermModels: jest.fn(),
    fetchTermModel: jest.fn(),
    hasSDLContent: jest.fn().mockReturnValue(true),
    sdlContent: jest.fn().mockReturnValue({
      resourceBundles: {
        messages: {
          modelResultsPlanTypesInfo: 'Models: {date}',
          datePlaceholder: '{date}',
          modelResultsDateFormat: 'MMM dd, yyyy',
          esppAvailableMessage: 'ESPP_AVAILABLE',
        },
      },
    }),
  } as any;

  const mockFetchTermModelsService = {
    termDate: jest.fn().mockReturnValue(''),
    termId: jest.fn().mockReturnValue(''),
  } as any;
  const mockUtilityService = {
    isStringNotEmpty: jest.fn().mockReturnValue(true),
  } as any;
  const mockFdWindowService = {
    getWindow: jest.fn().mockReturnValue({ isTocV2Available: false }),
  } as any;
  const mockSdlContentService = {} as any;
  const mockEmploymentDetailsService = {} as any;

  // provide a default resourceBundle on the prototype so constructor effects
  // that call `buildModelResultsInfoText()` won't throw during construction
  // when tests later override `resourceBundle` per-case.
  (
    SpsTerminationFeatureManagementAwardsComponent as any
  ).prototype.resourceBundle = {
    messages: {
      modelResultsPlanTypesInfo: 'Models: {date}',
      datePlaceholder: '{date}',
      modelResultsDateFormat: 'MMM dd, yyyy',
      esppAvailableMessage: 'ESPP_AVAILABLE',
    },
    // include other keys the template expects to avoid runtime errors
    planDivSecurityInfo: {},
  } as any;

  const createComponent = createComponentFactory({
    component: SpsTerminationFeatureManagementAwardsComponent,
    detectChanges: false,
    providers: [
      { provide: ManagementStore, useValue: mockStore },
      { provide: FetchTermModelsService, useValue: mockFetchTermModelsService },
      { provide: UtilityService, useValue: mockUtilityService },
      { provide: FdWindowService, useValue: mockFdWindowService },
      { provide: SDLContentService, useValue: mockSdlContentService },
      {
        provide: EmploymentDetailsService,
        useValue: mockEmploymentDetailsService,
      },
      { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        // supply InputSignal-backed inputs as functions to match input.required<T>()
        terminationDetails: (() => ({
          terminationDate: '2023-01-01',
          terminationId: 'T1',
        })) as unknown as any,
        esppAvailable: (() => true) as unknown as any,
      },
    });
    // ensure resourceBundle.messages exists before running change detection
    (spectator.component as any).resourceBundle = {
      messages: {
        modelResultsPlanTypesInfo: 'Models: {date}',
        datePlaceholder: '{date}',
        modelResultsDateFormat: 'MMM dd, yyyy',
        esppAvailableMessage: 'ESPP_AVAILABLE',
      },
      // include other keys the template expects to avoid runtime errors
      planDivSecurityInfo: {},
    } as any;
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('constructor effect sets awards, plans and flags when store has term models', () => {
    // effect runs in constructor during change detection; trigger it here
    spectator.detectChanges();
    expect(spectator.component.awards).toEqual(mockTermModels);
    expect(spectator.component.plans.length).toBe(2);
    expect(spectator.component.noGrants).toBe(false);
    expect(spectator.component.divisionalRestricted).toBe(true);
  });

  it('getPerformanceIndicator returns true for performance plans', () => {
    const comp = spectator.component;
    expect(
      comp.getPerformanceIndicator({
        planType: TermModelConstant.CASH_PERF,
      } as any),
    ).toBe(true);
    expect(
      comp.getPerformanceIndicator({
        planType: TermModelConstant.RSU_PERF,
      } as any),
    ).toBe(true);
    expect(comp.getPerformanceIndicator({ planType: 'OTHER' } as any)).toBe(
      false,
    );
  });

  it('getTableHeaders reads from resourceBundle using planType', () => {
    const comp = spectator.component as any;
    const key = 'cash' + TermModelConstant.TABLE_HEADER;
    comp.resourceBundle = { [key]: { header: 'h' } } as any;
    const headers = comp.getTableHeaders({ planType: 'CASH' } as any);
    expect(headers.header).toBe('h');
  });

  it('downloadTermModelExcel calls store.exportTermModels with expected args', () => {
    const comp = spectator.component as any;
    // set fetch service values used in the export
    mockFetchTermModelsService.termDate.mockReturnValue('2024-02-02');
    mockFetchTermModelsService.termId.mockReturnValue('TERM1');
    // call
    comp.downloadTermModelExcel();
    expect(mockStore.getLink).toHaveBeenCalledWith(TermModelConstant.AWARD);
    const callArgs = (mockStore.exportTermModels as jest.Mock).mock.calls[0][0];
    expect(callArgs.slice(0, 3)).toEqual([
      'http://term-model',
      '2024-02-02',
      'TERM1',
    ]);
  });

  it('buildModelResultsInfoText returns formatted text and appends espp message when available', () => {
    const comp = spectator.component as any;
    comp.resourceBundle = {
      messages: {
        modelResultsPlanTypesInfo: 'Models: {date}',
        datePlaceholder: '{date}',
        modelResultsDateFormat: 'MMM dd, yyyy',
        esppAvailableMessage: 'ESPP_AVAILABLE',
      },
    } as any;
    mockFetchTermModelsService.termDate.mockReturnValue('2024-02-03T00:00:00Z');
    // esppAvailable InputSignal returns true per beforeEach props
    const out = (comp as any).buildModelResultsInfoText();
    expect(typeof out).toBe('string');
    expect(out).toContain('Models:');
    expect(out).toContain('ESPP_AVAILABLE');
  });

  it('loadSDLContent sets resourceBundle when store has SDL content', () => {
    // arrange store to return sdl content
    const sdl = { resourceBundles: { modelResults: { info: 1 } } } as any;
    mockStore.hasSDLContent = jest.fn().mockReturnValue(true);
    mockStore.sdlContent = jest.fn().mockReturnValue(sdl);
    const comp = spectator.component as any;
    (comp as any).loadSDLContent();
    expect(comp.resourceBundle).toBeDefined();
    expect(comp.modelResult).toEqual((sdl as any).resourceBundles.modelResults);
  });

  it('sets csvErrorMessage when store.csvExportError is present and no term models', () => {
    // arrange: store reports a csv error and no term models
    const csvErr = { code: 'CSV', message: 'csv failed' } as any;
    mockStore.csvExportError = jest.fn().mockReturnValue(csvErr);
    mockStore.hasTermModels = jest.fn().mockReturnValue(false);

    spectator.detectChanges();

    const comp = spectator.component as any;
    expect(comp.csvErrorMessage).toEqual(csvErr);
    expect(comp.plans).toEqual([]);
  });

  it('sets plans to empty when store.hasTermModels returns false', () => {
    mockStore.hasTermModels = jest.fn().mockReturnValue(false);
    mockStore.termModels = jest.fn();

    spectator.detectChanges();
    const comp = spectator.component as any;
    expect(comp.plans).toEqual([]);
  });

  it('buildModelResultsInfoText returns empty string when no termDate', () => {
    const comp = spectator.component as any;
    comp.resourceBundle = {
      messages: {
        modelResultsPlanTypesInfo: 'Models: {date}',
        datePlaceholder: '{date}',
        modelResultsDateFormat: 'MMM dd, yyyy',
        esppAvailableMessage: 'ESPP_AVAILABLE',
      },
    } as any;
    // ensure no term date is set on fetch service
    mockFetchTermModelsService.termDate.mockReturnValue('');

    const out = comp.buildModelResultsInfoText();
    expect(out).toBe('');
  });

  it('requestTermModelIfNeeded triggers fetch when awards missing and terminationDetails present', () => {
    const comp = spectator.component as any;
    comp.awards = null;
    comp.terminationDetails = (() => ({
      terminationDate: '2024-02-02',
      terminationId: 'T1',
    })) as any;
    // ensure template dependencies exist before triggering detectChanges
    comp.resourceBundle = {
      messages: {
        modelResultsPlanTypesInfo: 'Models: {date}',
        datePlaceholder: '{date}',
      },
      planDivSecurityInfo: {},
    } as any;
    // utilityService mocked to return true in providers
    comp.requestTermModelIfNeeded();
    expect(mockStore.fetchTermModel).toHaveBeenCalled();
  });

  it('requestTermModelIfNeeded does not fetch when awards present', () => {
    const comp = spectator.component as any;
    comp.awards = { something: true } as any;
    comp.terminationDetails = (() => ({
      terminationDate: '2024-02-02',
      terminationId: 'T1',
    })) as any;
    comp.resourceBundle = {
      messages: {
        modelResultsPlanTypesInfo: 'Models: {date}',
        datePlaceholder: '{date}',
      },
      planDivSecurityInfo: {},
    } as any;
    (mockStore.fetchTermModel as jest.Mock).mockClear();
    comp.requestTermModelIfNeeded();
    expect(mockStore.fetchTermModel).not.toHaveBeenCalled();
  });
});
