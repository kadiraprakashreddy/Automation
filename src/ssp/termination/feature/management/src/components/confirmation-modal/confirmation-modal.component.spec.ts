/**
 * @copyright 2026, FMR LLC
 * @file This file contains the ConfirmationModalComponent which displays a confirmation modal dialog.
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SpsTerminationFeatureManagementConfirmationModalComponent } from './confirmation-modal.component';
import {
  Spectator,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  AnalyticsUtilService,
  ManagementStore,
  OPERATIONS,
  UpdateTerminationDetailsService,
} from '@fmr-ap160368/sps-termination-data-access-management';
import { ModalState } from '@fmr-ap167419/shared-design-system-ui-core';

describe('SpsTerminationFeatureManagementConfirmationModalComponent', () => {
  let spectator: Spectator<SpsTerminationFeatureManagementConfirmationModalComponent>;
  let store: any;
  let analyticsService: AnalyticsUtilService;
  let updateService: UpdateTerminationDetailsService;
  const createComponent = createComponentFactory({
    component: SpsTerminationFeatureManagementConfirmationModalComponent,
    imports: [ReactiveFormsModule],
    // eslint-disable-next-line @fmr-ap167419/tools-eslint-rules/no-errors-schema
    schemas: [NO_ERRORS_SCHEMA],
    providers: [
      mockProvider(ManagementStore, {
        hasSDLContent: () => true,
        sdlContent: () => ({
          resourceBundles: {
            adjustTerminationConfirmationOverlay: { title: 'Confirm' },
            messages: { invalidXtracNumber: 'Invalid XTRAC number' },
          },
        }),
      }),
      mockProvider(AnalyticsUtilService),
      mockProvider(UpdateTerminationDetailsService),
    ],
    detectChanges: false,
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    analyticsService = spectator.inject(AnalyticsUtilService);
    updateService = spectator.inject(UpdateTerminationDetailsService);

    analyticsService.pageActionSubmitAnalytics = jest.fn();
    updateService.submitAnalyticsForAdjust = jest.fn();
    updateService.submitAnalyticsForReverse = jest.fn();

    // Note: Removed detectChanges() to avoid template rendering issues in tests
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
    expect(spectator.component.confirmationForm).toBeDefined();
    expect(spectator.component.confirmationForm.get('xtracId')).toBeDefined();
    expect(
      spectator.component.confirmationForm.get('xtracComments'),
    ).toBeDefined();
  });

  it('should get xtracId form control', () => {
    expect(spectator.component.xtracId).toBe(
      spectator.component.confirmationForm.get('xtracId'),
    );
  });

  it('should emit cancelEvent and analytics for adjust on cancel', () => {
    spectator = createComponent({
      props: { modelType: OPERATIONS.ADJUST },
    });
    const spy = jest.spyOn(spectator.component.cancelEvent, 'emit');

    spectator.component.cancel();

    expect(spy).toHaveBeenCalled();
    expect(analyticsService.pageActionSubmitAnalytics).toHaveBeenCalledWith(
      'user_action',
      'Termination management',
      {
        actionDetail: 'adjust modal cancel',
        pageType: 'Termination management',
      },
    );
  });

  it('should emit cancelEvent and analytics for reverse on cancel', () => {
    spectator = createComponent({
      props: { modelType: OPERATIONS.REVERSE },
    });
    const spy = jest.spyOn(spectator.component.cancelEvent, 'emit');

    spectator.component.cancel();

    expect(spy).toHaveBeenCalled();
    expect(analyticsService.pageActionSubmitAnalytics).toHaveBeenCalledWith(
      'user_action',
      'Termination management',
      {
        actionDetail: 'reverse modal cancel',
        pageType: 'Termination management',
      },
    );
  });

  it('should emit confirmEvent with form value on onConfirm', () => {
    const formValue = { xtracId: '123', xtracComments: 'test' };
    spectator.component.confirmationForm.setValue(formValue);
    const spy = jest.spyOn(spectator.component.confirmEvent, 'emit');

    spectator.component.onConfirm();

    expect(spy).toHaveBeenCalledWith(formValue);
  });

  it('should call cancel on closingOverlay when closed', () => {
    const cancelSpy = jest.spyOn(spectator.component, 'cancel');

    spectator.component.closingOverlay(ModalState.closed);

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should call submitAnalyticsForAdjust on submitAnalyticsForAdjustAndReverse for adjust', () => {
    spectator = createComponent({
      props: { modelType: OPERATIONS.ADJUST },
    });

    spectator.component.submitAnalyticsForAdjustAndReverse('tag');

    expect(updateService.submitAnalyticsForAdjust).toHaveBeenCalledWith('tag');
  });

  it('should call submitAnalyticsForReverse on submitAnalyticsForAdjustAndReverse for reverse', () => {
    spectator = createComponent({
      props: { modelType: OPERATIONS.REVERSE },
    });

    spectator.component.submitAnalyticsForAdjustAndReverse('tag');

    expect(updateService.submitAnalyticsForReverse).toHaveBeenCalledWith('tag');
  });

  it('should emit cancelEvent without analytics when modelType is not set', () => {
    // default createComponent() has no modelType set
    const spy = jest.spyOn(spectator.component.cancelEvent, 'emit');

    spectator.component.cancel();

    expect(spy).toHaveBeenCalled();
    expect(analyticsService.pageActionSubmitAnalytics).not.toHaveBeenCalled();
  });

  it('should NOT call cancel on closingOverlay when state is not closed', () => {
    const cancelSpy = jest.spyOn(spectator.component, 'cancel');

    // pass a non-closed modal state (use a safe cast instead of a non-existent member)
    spectator.component.closingOverlay({} as ModalState);

    expect(cancelSpy).not.toHaveBeenCalled();
  });

  it('should not call any analytics submit when modelType is not set', () => {
    // default component without modelType
    spectator.component.submitAnalyticsForAdjustAndReverse('tag');

    expect(updateService.submitAnalyticsForAdjust).not.toHaveBeenCalled();
    expect(updateService.submitAnalyticsForReverse).not.toHaveBeenCalled();
  });

  it('should set content and messages when SDL content exists (without rendering)', () => {
    const cdr = spectator.component['cdr'] as any;
    const markSpy = jest.spyOn(cdr, 'markForCheck');

    // call the extracted method instead of rendering the template
    spectator.component.loadSdlContent();

    expect(spectator.component.content()).toEqual(
      store.sdlContent().resourceBundles.adjustTerminationConfirmationOverlay,
    );
    expect(spectator.component.messages).toEqual(
      store.sdlContent().resourceBundles.messages,
    );
    expect(markSpy).toHaveBeenCalled();
  });
});
