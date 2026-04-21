/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { SpsTerminationFeatureManagementManageTerminationComponent } from './manage-termination.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { Subject } from 'rxjs';
import { signal } from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  AnalyticsTag,
  AnalyticsUtilService,
  ErrorHandlingUtils,
  ErrorMessage,
  ManagementStore,
  ParticipantUI,
  SDLContentService,
  UpdateTerminationDetailsService,
} from '@fmr-ap160368/sps-termination-data-access-management';
import { FdWindowService } from '@fmr-ap123285/angular-utils';

import { LoadingStatusEnum } from '@fmr-ap167419/shared-core-data-access-loading-status';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('SpsTerminationFeatureManagementManageTerminationComponent', () => {
  let spectator: Spectator<SpsTerminationFeatureManagementManageTerminationComponent>;
  let mockStore: any;
  let mockWindowService: any;
  let mockAnalyticsService: any;
  let mockParticipantUI: any;
  let mockUpdateTerminationDetails: any;
  let mockSDLService: any;

  const createComponent = createComponentFactory({
    component: SpsTerminationFeatureManagementManageTerminationComponent,
    detectChanges: false,
    shallow: true,
    mocks: [],
    providers: [provideHttpClient(withInterceptorsFromDi())],
  });

  beforeEach(() => {
    mockStore = {
      hasSDLContent: signal(false),
      sdlContent: signal(null),
      hasEmploymentDetails: signal(false),
      employmentDetails: signal(null),
      employmentDetailsError: signal(null),
      loadingStatus: signal({ status: LoadingStatusEnum.Idle }),
      errorMessage: signal(null),
      fetchEmployeeDetails: jest.fn(),
      loadSDLContent: jest.fn(),
      updateParticipantHeaderStatus: jest.fn(),
      updateTocStatus: jest.fn(),
    };

    mockWindowService = {
      getWindow: jest.fn().mockReturnValue({
        config: {
          participantHeaderURI: 'defaultUri',
          expandedSections: [],
          participantFeatureContext: 'defaultContext',
        },
        isPartCardAvailable: true,
      }),
    };

    mockAnalyticsService = {
      pageViewSubmitAnalytics: jest.fn(),
    };

    mockParticipantUI = {
      shouldDisplayTermModels: undefined,
      contentURI: undefined,
      setUIBehavior: jest.fn(),
    };

    const updateSuccessSubject = new Subject<boolean>();
    mockUpdateTerminationDetails = {
      updateSuccess: updateSuccessSubject,
    };

    mockSDLService = {
      resourceBundles: null,
    };

    spectator = createComponent({
      providers: [
        { provide: ManagementStore, useValue: mockStore },
        { provide: FdWindowService, useValue: mockWindowService },
        { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
        { provide: ParticipantUI, useValue: mockParticipantUI },
        {
          provide: UpdateTerminationDetailsService,
          useValue: mockUpdateTerminationDetails,
        },
        { provide: SDLContentService, useValue: mockSDLService },
      ],
    });

    mockStore.hasSDLContent.set(true);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize properties from window config', () => {
      const mockWindow = {
        config: {
          participantHeaderURI: 'test-uri',
          expandedSections: 'sections',
          participantFeatureContext: 'context',
        },
        isPartCardAvailable: true,
        isTocV2Available: true,
      };
      mockWindowService.getWindow.mockReturnValue(mockWindow);

      spectator.component.ngOnInit();

      expect(spectator.component.participantHeaderURI).toBe('test-uri');
      expect(spectator.component.expandedSections).toBe('sections');
      expect(spectator.component.participantContext).toBe('context');
      expect(spectator.component.isParticipantCardAvailable).toBe(true);
      expect(spectator.component.isTocV2Available).toBe(true);
      expect(mockStore.fetchEmployeeDetails).toHaveBeenCalled();
    });

    it('should set isTocV2Available to false if not in window', () => {
      const mockWindow = {
        config: {
          participantHeaderURI: 'test-uri',
          expandedSections: 'sections',
          participantFeatureContext: 'context',
        },
        isPartCardAvailable: true,
      };
      mockWindowService.getWindow.mockReturnValue(mockWindow);

      spectator.component.ngOnInit();

      expect(spectator.component.isTocV2Available).toBe(false);
    });

    it('should call sendErrorEvent if participantHeaderURI is null', () => {
      const mockWindow = {
        config: {
          participantHeaderURI: null,
          expandedSections: 'sections',
          participantFeatureContext: 'context',
        },
        isPartCardAvailable: true,
      };
      mockWindowService.getWindow.mockReturnValue(mockWindow);
      const sendErrorEventSpy = jest.spyOn(
        spectator.component as any,
        'sendErrorEvent',
      );

      spectator.component.ngOnInit();

      expect(sendErrorEventSpy).toHaveBeenCalled();
    });

    it('should call sendErrorEvent if participantContext is empty', () => {
      const mockWindow = {
        config: {
          participantHeaderURI: 'test-uri',
          expandedSections: 'sections',
          participantFeatureContext: '',
        },
        isPartCardAvailable: true,
      };
      mockWindowService.getWindow.mockReturnValue(mockWindow);
      const sendErrorEventSpy = jest.spyOn(
        spectator.component as any,
        'sendErrorEvent',
      );

      spectator.component.ngOnInit();

      expect(sendErrorEventSpy).toHaveBeenCalled();
    });
  });

  describe('effect', () => {
    it('should handle SDL content changes', () => {
      const mockContent = {
        resourceBundles: {
          pageHeaderSection: { title: 'Header', eReviewNo: 'test' },
        },
      };
      mockStore.hasSDLContent.set(true);
      mockStore.sdlContent.set(mockContent);
      (spectator.component as any).handleSDLContentChanges();

      expect(spectator.component.content).toEqual(mockContent);
      expect(spectator.component.headerContent).toEqual({
        title: 'Header',
        eReviewNo: 'test',
      });
    });

    it('should handle employment details changes when contentURI is not set', () => {
      mockStore.hasEmploymentDetails.set(true);
      mockStore.hasSDLContent.set(false);
      mockStore.employmentDetails.set({ id: 1 });
      mockParticipantUI.contentURI = undefined;
      const handleEmploymentDetailsChangesSpy = jest.spyOn(
        spectator.component as any,
        'handleEmploymentDetailsChanges',
      );

      spectator.detectChanges();

      expect(mockParticipantUI.setUIBehavior).toHaveBeenCalledWith(
        { id: 1 },
        true,
      );
      expect(handleEmploymentDetailsChangesSpy).toHaveBeenCalled();
    });

    it('should not set UI behavior if contentURI is set', () => {
      mockStore.hasEmploymentDetails.set(true);
      mockStore.hasSDLContent.set(false);
      mockStore.employmentDetails.set({ id: 1 });
      mockParticipantUI.contentURI = 'set';
      const handleEmploymentDetailsChangesSpy = jest.spyOn(
        spectator.component as any,
        'handleEmploymentDetailsChanges',
      );

      spectator.detectChanges();

      expect(mockParticipantUI.setUIBehavior).not.toHaveBeenCalled();
      expect(mockStore.loadSDLContent).not.toHaveBeenCalled();
      expect(handleEmploymentDetailsChangesSpy).toHaveBeenCalled();
    });

    it('should handle employment details error for term models', () => {
      mockStore.employmentDetailsError.set({ message: 'error' });
      mockStore.hasEmploymentDetails.set(false);
      mockStore.hasSDLContent.set(false);
      mockParticipantUI.shouldDisplayTermModels = true;

      spectator.detectChanges();

      expect(spectator.component.pageError).toEqual({ message: 'error' });
      expect(mockStore.loadSDLContent).toHaveBeenCalled();
      expect(mockAnalyticsService.pageViewSubmitAnalytics).toHaveBeenCalledWith(
        AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.employeeDetailsServiceError },
      );
    });

    it('should handle employment details error for termination management', () => {
      mockStore.employmentDetailsError.set({ message: 'error' });
      mockStore.hasEmploymentDetails.set(false);
      mockStore.hasSDLContent.set(false);
      mockParticipantUI.shouldDisplayTermModels = false;

      spectator.detectChanges();

      expect(mockAnalyticsService.pageViewSubmitAnalytics).toHaveBeenCalledWith(
        AnalyticsTag.terminationManagement + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.employeeDetailsServiceError },
      );
    });

    it('should submit employment details error analytics only once', () => {
      mockStore.employmentDetailsError.set({ message: 'error' });
      mockStore.hasEmploymentDetails.set(false);
      mockStore.hasSDLContent.set(false);
      mockParticipantUI.shouldDisplayTermModels = true;

      spectator.detectChanges();

      mockStore.loadingStatus.set(LoadingStatusEnum.Resolved);
      spectator.detectChanges();

      expect(
        mockAnalyticsService.pageViewSubmitAnalytics,
      ).toHaveBeenCalledTimes(1);
      expect(mockAnalyticsService.pageViewSubmitAnalytics).toHaveBeenCalledWith(
        AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.employeeDetailsServiceError },
      );
    });

    it('should handle store error with loading status error', () => {
      mockStore.loadingStatus.set({ error: true });
      mockStore.errorMessage.set({ title: 'Error', detail: 'Detail' });
      mockStore.hasEmploymentDetails.set(false);
      mockStore.hasSDLContent.set(false);
      mockStore.employmentDetailsError.set(null);
      const handleAnalyticsErrorSpy = jest.spyOn(
        spectator.component as any,
        'handleAnalyticsError',
      );

      spectator.detectChanges();

      expect(spectator.component.tridionDataErrorMessage).toEqual({
        title: 'Error',
        detail: 'Detail',
      });
      expect(handleAnalyticsErrorSpy).toHaveBeenCalled();
    });
  });

  describe('handleAnalyticsError', () => {
    it('should call analytics for term models', () => {
      mockParticipantUI.shouldDisplayTermModels = true;

      (spectator.component as any).handleAnalyticsError();

      expect(mockAnalyticsService.pageViewSubmitAnalytics).toHaveBeenCalledWith(
        AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.sdlServiceError },
      );
    });

    it('should call analytics for termination management', () => {
      mockParticipantUI.shouldDisplayTermModels = false;

      (spectator.component as any).handleAnalyticsError();

      expect(mockAnalyticsService.pageViewSubmitAnalytics).toHaveBeenCalledWith(
        AnalyticsTag.terminationManagement + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.sdlServiceError },
      );
    });
  });

  describe('handleSDLContentChanges', () => {
    it('should set content and headerContent', () => {
      const content = {
        resourceBundles: {
          pageHeaderSection: { title: 'Test', eReviewNo: 'test' },
        },
      };
      mockStore.sdlContent.set(content);
      (spectator.component as any).handleSDLContentChanges();

      expect(spectator.component.content).toEqual(content);
      expect(spectator.component.headerContent).toEqual({
        title: 'Test',
        eReviewNo: 'test',
      });
    });
  });

  describe('handleEmploymentDetailsChanges', () => {
    it('should subscribe to updateSuccess', () => {
      const employmentDetails = { id: 1 };
      mockStore.employmentDetails.set(employmentDetails);
      (spectator.component as any).handleEmploymentDetailsChanges();

      spectator.detectChanges();

      // Simulate update
      (mockUpdateTerminationDetails.updateSuccess as Subject<boolean>).next(
        true,
      );

      expect(spectator.component.updateSuccess).toBe(true);
    });
  });

  describe('updateParticipantHeaderStatus', () => {
    it('should set participantError if isError true', () => {
      const mockError: ErrorMessage = {
        code: 'test',
        title: 'Test',
        detail: 'Detail',
        parameters: [],
        links: [],
      };
      jest
        .spyOn(ErrorHandlingUtils, 'getErrorMessage')
        .mockReturnValue(mockError);

      spectator.component.updateParticipantHeaderStatus({ isError: true });

      expect(spectator.component.participantError).toBe(mockError);
    });

    it('should not set participantError if isError false', () => {
      spectator.component.updateParticipantHeaderStatus({ isError: false });

      expect(spectator.component.participantError).toBeUndefined();
    });
  });

  describe('updateTocStatus', () => {
    it('should set participantError if isTOCError true', () => {
      const mockError: ErrorMessage = {
        code: 'test',
        title: 'Test',
        detail: 'Detail',
        parameters: [],
        links: [],
      };
      jest
        .spyOn(ErrorHandlingUtils, 'getErrorMessage')
        .mockReturnValue(mockError);

      spectator.component.updateTocStatus({ isError: true });

      expect(spectator.component.participantError).toBe(mockError);
    });

    it('should not set participantError if isTOCError false', () => {
      spectator.component.updateTocStatus({ isError: false });

      expect(spectator.component.participantError).toBeUndefined();
    });
  });

  describe('sendErrorEvent', () => {
    it('should set participantError without resourceBundles', () => {
      mockSDLService.resourceBundles = null;
      const mockError: ErrorMessage = {
        code: 'test',
        title: 'Test',
        detail: 'Detail',
        parameters: [],
        links: [],
      };
      jest
        .spyOn(ErrorHandlingUtils, 'getErrorMessage')
        .mockReturnValue(mockError);

      (spectator.component as any).sendErrorEvent();

      expect(spectator.component.participantError).toBe(mockError);
    });

    it('should set participantError with resourceBundles', () => {
      mockSDLService.resourceBundles = {
        messages: {
          serviceErrorTitle: 'Title',
          serviceErrorBody: 'Body',
        },
      };
      const mockError: ErrorMessage = {
        code: 'test',
        title: 'Test',
        detail: 'Detail',
        parameters: [],
        links: [],
      };
      jest
        .spyOn(ErrorHandlingUtils, 'getErrorMessage')
        .mockReturnValue(mockError);

      (spectator.component as any).sendErrorEvent(new Error('test'));

      expect(ErrorHandlingUtils.getErrorMessage).toHaveBeenCalledWith(
        new Error('test'),
        'Title',
        'Body',
      );
      expect(spectator.component.participantError).toBe(mockError);
    });
  });
});
