/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { ChangeDetectorRef } from '@angular/core';

import { SpsTerminationFeatureManagementEmployeeComponent } from './employee.component';
import {
  AnalyticsUtilService,
  EmploymentDetailsModel,
  EmploymentDetailsService,
  ErrorMessage,
  ManagementStore,
  ParticipantUI,
  TermModelConstant,
  TermModelStoreConstants,
  TerminationDetails,
  UtilityService,
} from '@fmr-ap160368/sps-termination-data-access-management';
import { FdWindowService } from '@fmr-ap123285/angular-utils';

describe('SpsTerminationFeatureManagementEmployeeComponent', () => {
  let spectator: Spectator<SpsTerminationFeatureManagementEmployeeComponent>;

  const createFactory = createComponentFactory({
    component: SpsTerminationFeatureManagementEmployeeComponent,
    shallow: true,
  });

  const createComponent = (overrides: Partial<any> = {}) => {
    const fakeStore: any = {
      fetchTermModelError: jest.fn(
        () => (overrides as any).fetchTermModelError,
      ),
      hasTermRuleIds: jest.fn(() => (overrides as any).hasTermRuleIds ?? false),
      hasEmploymentDetails: jest.fn(
        () => (overrides as any).hasEmploymentDetails ?? false,
      ),
      hasTermModels: jest.fn(() => (overrides as any).hasTermModels ?? false),
      isTerminationUpdating: jest.fn(
        () => (overrides as any).isTerminationUpdating ?? false,
      ),
      terminationUpdateState: jest.fn(
        () => (overrides as any).terminationUpdateState ?? false,
      ),
      loadingStatus: jest.fn((key: string) => {
        if (key === TermModelStoreConstants.TERM_MODELS_KEY) {
          return (overrides as any).termModelsLoadingStatus ?? 'idle';
        }
        return 'idle';
      }),
      isTermModelsLoading: jest.fn(
        () => (overrides as any).isTermModelsLoading ?? false,
      ),
      fetchEmployeeDetails: jest.fn(() => undefined),
      fetchTermRuleIds: jest.fn(() => undefined),
      employmentDetails: jest.fn(() => (overrides as any).employmentDetails),
    };

    const fakeUtility: Partial<UtilityService> = {
      isStringNotEmpty: jest.fn((v: any) => !!v),
    } as any;

    const fakeAnalytics: Partial<AnalyticsUtilService> = {
      pageViewSubmitAnalytics: jest.fn(),
    } as any;

    const fakeWindow = {
      getWindow: jest.fn(() => (overrides as any).window ?? {}),
    } as Partial<FdWindowService>;

    const fakeEmploymentDetailsService =
      {} as Partial<EmploymentDetailsService>;
    const fakeParticipantUI = {} as Partial<ParticipantUI>;

    spectator = createFactory({
      providers: [
        { provide: ManagementStore, useValue: fakeStore },
        { provide: UtilityService, useValue: fakeUtility },
        { provide: AnalyticsUtilService, useValue: fakeAnalytics },
        {
          provide: EmploymentDetailsService,
          useValue: fakeEmploymentDetailsService,
        },
        { provide: ParticipantUI, useValue: fakeParticipantUI },
        { provide: FdWindowService, useValue: fakeWindow },
        { provide: ChangeDetectorRef, useValue: { markForCheck: jest.fn() } },
      ],
    });

    return {
      spectator,
      fakeStore,
      fakeUtility,
      fakeAnalytics,
      fakeWindow,
      fakeEmploymentDetailsService,
      fakeParticipantUI,
    };
  };

  it('calls fetchTermRuleIds on init and sets isTocV2Available', () => {
    const { spectator: s, fakeStore } = createComponent({
      hasTermRuleIds: false,
      window: { isTocV2Available: true },
    });
    spectator = s;

    spectator.detectChanges();

    expect((fakeStore as any).fetchTermRuleIds).toHaveBeenCalled();
    expect(spectator.component.isTocV2Available).toBe(true);
  });

  it('handles fetchTermModelError from store', () => {
    const err: ErrorMessage = { message: 'boom' } as any;
    const { spectator: s } = createComponent({
      fetchTermModelError: err,
    });
    spectator = s;

    spectator.detectChanges();

    expect(spectator.component.fetchTermModelError).toBe(err);
  });

  it('processes employment details and maps Y/N flags to YES/NO and triggers analytics when missing termination info', () => {
    const termination: TerminationDetails = {
      terminationReversalIndicator: TermModelConstant.Y,
      activeRuleIndicator: TermModelConstant.N,
      terminationDate: '',
      terminationId: '',
    } as any;

    const employment: EmploymentDetailsModel = {
      terminationDetails: termination,
    } as any;

    const {
      spectator: s,
      fakeUtility,
      fakeAnalytics,
    } = createComponent({
      hasEmploymentDetails: true,
      employmentDetails: employment,
      window: {},
    });
    spectator = s;

    (fakeUtility as any).isStringNotEmpty = jest.fn((v: any) => !!v);

    spectator.detectChanges();

    expect(spectator.component.employmentDetailsModel).toBe(employment);
    expect(
      spectator.component.terminationDetailsModel?.terminationReversalIndicator,
    ).toBe(TermModelConstant.YES);
    expect(
      spectator.component.terminationDetailsModel?.activeRuleIndicator,
    ).toBe(TermModelConstant.NO);
    expect((fakeAnalytics as any).pageViewSubmitAnalytics).toHaveBeenCalled();
  });

  it('does not trigger analytics when terminationDate and terminationId are present', () => {
    const termination: TerminationDetails = {
      terminationReversalIndicator: TermModelConstant.N,
      activeRuleIndicator: TermModelConstant.Y,
      terminationDate: '2025-01-01',
      terminationId: 'T-123',
    } as any;

    const employment: EmploymentDetailsModel = {
      terminationDetails: termination,
    } as any;

    const {
      spectator: s,
      fakeUtility,
      fakeAnalytics,
    } = createComponent({
      hasEmploymentDetails: true,
      employmentDetails: employment,
      window: {},
    });
    spectator = s;

    (fakeUtility as any).isStringNotEmpty = jest.fn(() => true);

    spectator.detectChanges();

    expect(
      (fakeAnalytics as any).pageViewSubmitAnalytics,
    ).not.toHaveBeenCalled();
  });

  it('sets termRuleIdsLoaded and showTermModel based on store flags', () => {
    const { spectator: s } = createComponent({
      hasTermRuleIds: true,
      hasTermModels: true,
      window: {},
    });
    spectator = s;

    spectator.detectChanges();

    expect(spectator.component.termRuleIdsLoaded).toBe(true);
    expect(spectator.component.showTermModel).toBe(true);
  });

  it('resets showTermModel to false when term models are not yet loaded', () => {
    const { spectator: s } = createComponent({
      hasTermRuleIds: true,
      hasTermModels: false,
      window: {},
    });
    spectator = s;

    spectator.detectChanges();

    expect(spectator.component.showTermModel).toBe(false);
  });

  it('calls fetchEmployeeDetails when terminationUpdateState is true', () => {
    const { spectator: s, fakeStore } = createComponent({
      terminationUpdateState: true,
      isTerminationUpdating: false,
      window: {},
    });
    spectator = s;

    spectator.detectChanges();

    expect((fakeStore as any).fetchEmployeeDetails).toHaveBeenCalled();
  });
});
