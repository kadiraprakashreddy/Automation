/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { DatePipe, SlicePipe } from '@angular/common';
import { FdWindowService } from '@fmr-ap123285/angular-utils';

import { SpsTerminationFeatureManagementTerminationDetailComponent } from './termination-detail.component';
import {
  AnalyticsTag,
  AnalyticsUtilService,
  EmploymentDetailsModel,
  ManagementStore,
  OPERATIONS,
  ResourceBundles,
  STATE,
  TermModelConstant,
  TruncatePipe,
  UtilityService,
  XtracDetailsModel,
} from '@fmr-ap160368/sps-termination-data-access-management';

describe('SpsTerminationFeatureManagementTerminationDetailComponent (unit)', () => {
  let spectator: Spectator<SpsTerminationFeatureManagementTerminationDetailComponent>;

  const mockEmploymentDetails: EmploymentDetailsModel = {
    employeeId: 'EMP123',
    firstName: 'John',
    lastName: 'Doe',
    hireDate: '2020-01-01',
    terminationDetails: {
      terminationDate: '2024-01-01',
      terminationId: 'TERM123',
      terminationReversalIndicator: TermModelConstant.N,
      activeRuleIndicator: TermModelConstant.Y,
    },
  } as any;

  const mockResourceBundles: ResourceBundles = {
    terminationDetailsSection: {
      title: 'Termination Details',
      labels: {},
    } as any,
    messages: {
      success: 'Success',
      error: 'Error',
    } as any,
    adjustTerminationConfirmationOverlay: {
      title: 'Adjust Confirmation',
      message: 'Confirm adjustment',
    } as any,
    reverseTerminationConfirmationOverlay: {
      title: 'Reverse Confirmation',
      message: 'Confirm reversal',
    } as any,
  } as any;

  const mockSDLContent = {
    resourceBundles: mockResourceBundles,
  } as any;

  const mockStore = {
    hasSDLContent: jest.fn().mockReturnValue(true),
    sdlContent: jest.fn().mockReturnValue(mockSDLContent),
    employmentDetails: jest.fn().mockReturnValue(mockEmploymentDetails),
    hasEmploymentDetails: jest.fn().mockReturnValue(true),
    isTerminationUpdating: jest.fn().mockReturnValue(false),
    terminationUpdateState: jest.fn().mockReturnValue(null),
    terminationUpdateError: jest.fn().mockReturnValue(null),
    isTerminationUpdateAllowed: jest.fn().mockReturnValue(true),
    fetchEmployeeDetails: jest.fn(),
    adjustTerminationDetails: jest.fn(),
    reverseTerminationDetails: jest.fn(),
  } as any;

  const mockUtilityService = {
    isNullOrUndefined: jest.fn().mockReturnValue(false),
  } as unknown as UtilityService;

  const mockAnalytics = {
    pageActionSubmitAnalytics: jest.fn(),
    pageViewSubmitAnalytics: jest.fn(),
  } as unknown as AnalyticsUtilService;

  const mockWindow = {
    config: { pageContextUser: 'NONSPARK', realm: 'TEST', clientId: 'C1' },
    isTocV2Available: true,
    getWindow: jest.fn().mockReturnValue({
      isTocV2Available: true,
      apis: { participantGrantDetails: 'https://example.test/grants' },
      config: { pageContextUser: 'NONSPARK', realm: 'TEST', clientId: 'C1' },
    }),
  } as any;

  const mockTruncatePipe = {
    transform: jest
      .fn()
      .mockImplementation((v, l) => (v ? v.substring(0, l) : v)),
  } as unknown as TruncatePipe;

  const mockDatePipe = {
    transform: jest.fn().mockReturnValue('2024-01-01'),
  } as unknown as DatePipe;

  const mockSlicePipe = {
    transform: jest
      .fn()
      .mockImplementation((v, s, e) => (v ? v.slice(s, e) : v)),
  } as unknown as SlicePipe;

  const createComponent = createComponentFactory({
    component: SpsTerminationFeatureManagementTerminationDetailComponent,
    imports: [ReactiveFormsModule],
    providers: [
      { provide: ManagementStore, useValue: mockStore },
      { provide: UtilityService, useValue: mockUtilityService },
      { provide: AnalyticsUtilService, useValue: mockAnalytics },
      { provide: FdWindowService, useValue: mockWindow },
      { provide: TruncatePipe, useValue: mockTruncatePipe },
      { provide: DatePipe, useValue: mockDatePipe },
      { provide: SlicePipe, useValue: mockSlicePipe },
      { provide: UntypedFormBuilder, useClass: UntypedFormBuilder },
      { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } },
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      spectator = createComponent();
      expect(spectator.component).toBeTruthy();
    });
  });

  describe('Getters', () => {
    it('should get termination details from store', () => {
      spectator = createComponent();
      expect(spectator.component.terminationDetails).toEqual(
        mockEmploymentDetails.terminationDetails,
      );
    });

    it('should return undefined when no employment details', () => {
      const store = {
        ...mockStore,
        hasEmploymentDetails: jest.fn().mockReturnValue(false),
        employmentDetails: jest.fn().mockReturnValue(null),
      };
      spectator = createComponent({
        providers: [{ provide: ManagementStore, useValue: store }],
      });
      expect(spectator.component.terminationDetails).toBeUndefined();
    });
  });

  describe('ngOnInit', () => {
    it('should fetch employee details if not in store', () => {
      const store = {
        ...mockStore,
        hasEmploymentDetails: jest.fn().mockReturnValue(false),
        fetchEmployeeDetails: jest.fn(),
      };
      spectator = createComponent({
        providers: [{ provide: ManagementStore, useValue: store }],
      });
      spectator.component.ngOnInit();
      expect(store.fetchEmployeeDetails).toHaveBeenCalled();
    });

    it('should not fetch employee details when already in store', () => {
      spectator = createComponent();
      spectator.component.ngOnInit();
      expect(mockStore.fetchEmployeeDetails).not.toHaveBeenCalled();
    });

    it('should submit reverse analytics when state is REVERSING', () => {
      const store = {
        ...mockStore,
        terminationUpdateState: jest.fn().mockReturnValue(STATE.REVERSING),
      };
      spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: store },
          { provide: AnalyticsUtilService, useValue: mockAnalytics },
        ],
      });
      spectator.component.ngOnInit();
      expect(
        (mockAnalytics as any).pageViewSubmitAnalytics,
      ).toHaveBeenCalledWith(expect.any(String), {
        viewName: expect.any(String),
      });
    });

    it('should submit adjust analytics when state is ADJUSTING', () => {
      const store = {
        ...mockStore,
        terminationUpdateState: jest.fn().mockReturnValue(STATE.ADJUSTING),
      };
      spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: store },
          { provide: AnalyticsUtilService, useValue: mockAnalytics },
        ],
      });
      spectator.component.ngOnInit();
      expect(
        (mockAnalytics as any).pageViewSubmitAnalytics,
      ).toHaveBeenCalledWith(expect.any(String), {
        viewName: expect.any(String),
      });
    });

    it('should submit initial analytics when state is INITIAL', () => {
      const store = {
        ...mockStore,
        terminationUpdateState: jest.fn().mockReturnValue(STATE.INITIAL),
      };
      spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: store },
          { provide: AnalyticsUtilService, useValue: mockAnalytics },
        ],
      });
      spectator.component.ngOnInit();
      expect(
        (mockAnalytics as any).pageViewSubmitAnalytics,
      ).toHaveBeenCalledWith(expect.any(String), {});
    });
  });

  describe('termIDValidation', () => {
    it('should set invalidTerminationId true for empty, dirty control', () => {
      spectator = createComponent();
      spectator.component.initiateAdjust();
      spectator.component.adjustForm?.get('id')?.setValue('');
      spectator.component.adjustForm?.get('id')?.markAsDirty();
      spectator.component.termIDValidation();
      expect(spectator.component.invalidTerminationId).toBe(true);
    });

    it('should set invalidTerminationId false when id has value', () => {
      spectator = createComponent();
      spectator.component.initiateAdjust();
      spectator.component.adjustForm?.get('id')?.setValue('ABC');
      spectator.component.adjustForm?.get('id')?.markAsDirty();
      spectator.component.termIDValidation();
      expect(spectator.component.invalidTerminationId).toBe(false);
    });
  });

  describe('initiateAdjust & adjust form', () => {
    it('should create adjust form with proper structure', () => {
      spectator = createComponent();
      spectator.component.initiateAdjust();
      const form = spectator.component.adjustForm;
      expect(form).toBeDefined();
      expect(form?.get('id')).toBeDefined();
      expect(form?.get('terminationDate')).toBeDefined();
    });

    it('should populate adjust form when termination details exist', () => {
      spectator = createComponent();
      spectator.component.initiateAdjust();
      (spectator.component as any).updateAdjustFormData();
      expect(spectator.component.adjustForm?.get('id')?.value).toBe('TERM123');
    });

    it('should handle null hireDate by adding comparison validator', () => {
      const store = {
        ...mockStore,
        employmentDetails: jest
          .fn()
          .mockReturnValue({ ...mockEmploymentDetails, hireDate: null }),
      };
      spectator = createComponent({
        providers: [{ provide: ManagementStore, useValue: store }],
      });
      spectator.component.initiateAdjust();
      expect(spectator.component.adjustForm).toBeDefined();
      expect(spectator.component.terminationDate?.validator).toBeTruthy();
    });

    it('should set minDate to 1001-01-01 when hireDate is null', () => {
      const store = {
        ...mockStore,
        employmentDetails: jest
          .fn()
          .mockReturnValue({ ...mockEmploymentDetails, hireDate: null }),
      };
      spectator = createComponent({
        providers: [{ provide: ManagementStore, useValue: store }],
      });
      spectator.component.initiateAdjust();
      expect(spectator.component.minDate).toEqual(new Date('1001-01-01'));
    });

    it('should set minDate to hire date when hireDate is provided', () => {
      spectator = createComponent();
      spectator.component.initiateAdjust();
      // hireDate is '2020-01-01' from mockEmploymentDetails
      const expectedMinDate = new Date(2020, 0, 1);
      expect(spectator.component.minDate).toEqual(expectedMinDate);
    });

    it('should mark userTryingToTypeMoreThan10CharForId when id length is 11 and slice the value', () => {
      spectator = createComponent();
      spectator.component.initiateAdjust();
      const idControl = spectator.component.adjustForm?.get('id');
      idControl?.setValue('12345678901');
      // valueChanges subscription should have run
      expect(spectator.component.userTryingToTypeMoreThan10CharForId).toBe(
        true,
      );
      expect((mockSlicePipe as any).transform).toHaveBeenCalled();
    });
  });

  describe('initiateReverse', () => {
    it('should set reverse modal content and operation', () => {
      spectator = createComponent();
      spectator.component.initiateReverse();
      expect(spectator.component.operation).toBe(OPERATIONS.REVERSE);
      expect(spectator.component.reverseModalContent).toBeDefined();
    });
  });

  describe('adjustConfirmation', () => {
    it('should call store.adjustTerminationDetails when confirmed', async () => {
      spectator = createComponent();
      spectator.component.initiateAdjust();
      const xtrac: XtracDetailsModel = {
        xtracNumber: 'X1',
        comment: 'c',
      } as any;
      await spectator.component.adjustConfirmation(xtrac);
      expect(mockStore.adjustTerminationDetails).toHaveBeenCalled();
    });
  });

  describe('reverseConfirmation', () => {
    it('should call store.reverseTerminationDetails when confirmed', async () => {
      spectator = createComponent();
      const xtrac: XtracDetailsModel = {
        xtracNumber: 'X2',
        comment: 'rev',
      } as any;
      await spectator.component.reverseConfirmation(xtrac);
      expect(mockStore.reverseTerminationDetails).toHaveBeenCalled();
    });
  });

  describe('Private helpers', () => {
    it('convertToDate returns Date for valid string', () => {
      spectator = createComponent();
      const out = (spectator.component as any).convertToDate('2024-03-01');
      expect(out).toBeInstanceOf(Date);
    });

    it('constructAdjustTerminationDate builds date string from controls', () => {
      spectator = createComponent();
      // prepare terminationDate controls
      spectator.component.initiateAdjust();
      spectator.component.adjustForm
        ?.get('terminationDate')
        ?.get('month')
        ?.setValue('0');
      spectator.component.adjustForm
        ?.get('terminationDate')
        ?.get('day')
        ?.setValue('2');
      spectator.component.adjustForm
        ?.get('terminationDate')
        ?.get('year')
        ?.setValue('2024');
      const out = (spectator.component as any).constructAdjustTerminationDate();
      expect((mockDatePipe as any).transform).toHaveBeenCalled();
      expect(out).toBe((mockDatePipe as any).transform.mock.results[0].value);
    });

    it('handleUpdateError will submit analytics on error (reverse modal present)', () => {
      const store = {
        ...mockStore,
        terminationUpdateError: jest.fn().mockReturnValue({ message: 'err' }),
        terminationUpdateState: jest.fn().mockReturnValue(STATE.REVERSING),
      };
      // provide utility service such that reverseModalContent is treated as present
      const util = {
        isNullOrUndefined: jest.fn().mockReturnValue(false),
      } as any;
      spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: store },
          { provide: UtilityService, useValue: util },
          { provide: AnalyticsUtilService, useValue: mockAnalytics },
        ],
      });
      (spectator.component as any).reverseModalContent = { title: 'r' } as any;
      (spectator.component as any).handleUpdateError();
      expect((mockAnalytics as any).pageViewSubmitAnalytics).toHaveBeenCalled();
      const calls = (mockAnalytics as any).pageViewSubmitAnalytics.mock.calls;
      expect(calls.some((c: any[]) => c[1]?.viewName)).toBe(true);
    });

    it('handleUpdateError will submit analytics on error (no reverse modal)', () => {
      const store = {
        ...mockStore,
        terminationUpdateError: jest.fn().mockReturnValue({ message: 'err' }),
        terminationUpdateState: jest.fn().mockReturnValue(STATE.ADJUSTING),
      };
      const util = {
        isNullOrUndefined: jest.fn().mockReturnValue(true),
      } as any;
      spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: store },
          { provide: UtilityService, useValue: util },
          { provide: AnalyticsUtilService, useValue: mockAnalytics },
        ],
      });
      (spectator.component as any).reverseModalContent = null as any;
      (spectator.component as any).handleUpdateError();
      expect((mockAnalytics as any).pageViewSubmitAnalytics).toHaveBeenCalled();
      const calls = (mockAnalytics as any).pageViewSubmitAnalytics.mock.calls;
      expect(calls.some((c: any[]) => c[1]?.viewName)).toBe(true);
    });
  });

  describe('Form validations and edge cases', () => {
    it('adjust should set displayDateErrors when invalid date', () => {
      spectator = createComponent();
      spectator.component.initiateAdjust();
      spectator.component.adjust();
      expect(spectator.component.displayDateErrors).toBe(true);
    });

    it('cancel should reset state to INITIAL', () => {
      spectator = createComponent();
      spectator.component.initiateAdjust();
      spectator.component.cancel();
      expect(spectator.component.state).toBe(STATE.INITIAL);
    });

    it('submitAnalyticsForAdjust should call analytics with actionDetail', () => {
      spectator = createComponent();
      spectator.component.submitAnalyticsForAdjust('save');
      expect(
        (mockAnalytics as any).pageActionSubmitAnalytics,
      ).toHaveBeenCalled();
      const args = (mockAnalytics as any).pageActionSubmitAnalytics.mock
        .calls[0];
      expect(args[2]).toHaveProperty('actionDetail', 'adjust|save');
    });

    it('ngOnInit should append spsClientId when pageContextUser is spark', () => {
      const win = {
        isTocV2Available: true,
        apis: { participantGrantDetails: 'https://ex' },
        config: { pageContextUser: AnalyticsTag.spark, spsClientId: 'SC' },
      } as any;
      const w = { getWindow: jest.fn().mockReturnValue(win) } as any;
      spectator = createComponent({
        providers: [{ provide: FdWindowService, useValue: w }],
      });
      spectator.component.ngOnInit();
      expect(spectator.component.participantGrantsUrl).toContain(
        '?spsClientId=SC',
      );
    });

    it('cancel should submit analytics when operation is ADJUST', () => {
      spectator = createComponent();
      spectator.component.operation = OPERATIONS.ADJUST;
      spectator.component.cancel();
      expect(
        (mockAnalytics as any).pageActionSubmitAnalytics,
      ).toHaveBeenCalled();
    });

    it('cancelAdjustModal should set doAdjust false and keep state ADJUST', () => {
      spectator = createComponent();
      spectator.component.state = STATE.ADJUST;
      spectator.component.doAdjust = true;
      spectator.component.cancelAdjustModal();
      expect(spectator.component.doAdjust).toBe(false);
      expect(spectator.component.state).toBe(STATE.ADJUST);
    });

    it('resetDateErrors should set displayDateErrors false', () => {
      spectator = createComponent();
      spectator.component.displayDateErrors = true;
      spectator.component.resetDateErrors();
      expect(spectator.component.displayDateErrors).toBe(false);
    });

    it('getStateEnum should return STATE enum', () => {
      spectator = createComponent();
      expect(spectator.component.getStateEnum()).toBe(STATE);
    });
  });
});
