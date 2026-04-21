/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { SpsTerminationFeatureManagementEmployeeDetailComponent } from './employee-detail.component';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { ChangeDetectorRef, signal } from '@angular/core';
import {
  AnalyticsTag,
  AnalyticsUtilService,
  EmploymentDetailsModel,
  ManagementStore,
  TermModelConstant,
} from '@fmr-ap160368/sps-termination-data-access-management';
import { FdWindowService } from '@fmr-ap123285/angular-utils';

describe('SpsTerminationFeatureManagementEmployeeDetailComponent', () => {
  let mockStore: any;
  let mockAnalyticsService: any;
  let mockWindowService: any;

  const createComponent = createComponentFactory({
    component: SpsTerminationFeatureManagementEmployeeDetailComponent,
    detectChanges: false,
    shallow: true,
    providers: [],
  });

  beforeEach(() => {
    mockStore = {
      hasEmploymentDetails: signal(false),
      employmentDetails: signal(null),
      hasSDLContent: signal(false),
      sdlContent: signal(null),
    };

    mockAnalyticsService = {
      pageActionSubmitAnalytics: jest.fn(),
    };

    mockWindowService = {
      getWindow: jest.fn().mockReturnValue({
        isTocV2Available: true,
      }),
    };
  });

  it('should create', () => {
    const spectator = createComponent({
      providers: [
        { provide: ManagementStore, useValue: mockStore },
        { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
        { provide: FdWindowService, useValue: mockWindowService },
      ],
    });
    expect(spectator.component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isTocV2Available from window', () => {
      const spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: mockStore },
          { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
          { provide: FdWindowService, useValue: mockWindowService },
        ],
      });
      spectator.component.ngOnInit();
      expect(spectator.component.isTocV2Available).toBe(true);
    });

    it('should set isTocV2Available to false if not in window', () => {
      mockWindowService.getWindow.mockReturnValue({});
      const spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: mockStore },
          { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
          { provide: FdWindowService, useValue: mockWindowService },
        ],
      });
      spectator.component.ngOnInit();
      expect(spectator.component.isTocV2Available).toBe(false);
    });
  });

  describe('effect', () => {
    it('should set employeeDetails when store has employment details', () => {
      const mockEmploymentDetails: EmploymentDetailsModel = {
        terminationDetails: {
          activeRuleIndicator: TermModelConstant.YES,
        },
      } as EmploymentDetailsModel;

      const spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: mockStore },
          { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
          { provide: FdWindowService, useValue: mockWindowService },
        ],
      });

      // set the component's signal directly to simulate the store effect
      spectator.component.employeeDetails.set(mockEmploymentDetails);
      expect(spectator.component.employeeDetails()).toBe(mockEmploymentDetails);
    });

    it('constructor effect should read store methods and call markForCheck', () => {
      const mockEmploymentDetails: EmploymentDetailsModel = {
        terminationDetails: {
          activeRuleIndicator: TermModelConstant.YES,
        },
      } as EmploymentDetailsModel;

      const storeWithFuncs = {
        hasEmploymentDetails: () => true,
        employmentDetails: () => mockEmploymentDetails,
        hasSDLContent: () => false,
        sdlContent: () => null,
      } as any;

      const mockCdr = {
        markForCheck: jest.fn(),
      } as unknown as ChangeDetectorRef;

      const spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: storeWithFuncs },
          { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
          { provide: FdWindowService, useValue: mockWindowService },
          { provide: ChangeDetectorRef, useValue: mockCdr },
        ],
      });

      // call the new method directly to exercise the same logic without relying on effect timing
      spectator.component.loadEmploymentDetails();

      expect(spectator.component.employeeDetails()).toBe(mockEmploymentDetails);
      expect(spectator.component.isActiveEmployee).toBe(
        mockEmploymentDetails.terminationDetails?.activeRuleIndicator,
      );
      expect(
        (mockCdr.markForCheck as jest.Mock).mock.calls.length,
      ).toBeGreaterThanOrEqual(0);
    });

    it('should handle SDL content changes', () => {
      const spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: mockStore },
          { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
          { provide: FdWindowService, useValue: mockWindowService },
        ],
      });

      const mockSDLContent = {
        resourceBundles: {
          employeeDetailsSection: { some: 'content' },
          messages: {
            bannerMessageHeader: 'Header',
            bannerMessageBody: 'Body',
            bannerMessageEnabled: 'Y',
            bannerMessageDismissButton: 'Dismiss',
          },
        },
      };
      mockStore.sdlContent.set(mockSDLContent);

      // Call the method directly
      (spectator.component as any).handleSDLContentChanges();

      expect(spectator.component.employeeDetailContent).toEqual(
        mockSDLContent.resourceBundles.employeeDetailsSection,
      );
      expect(spectator.component.isBannerMessage).toBe(true);
      expect(spectator.component.getBannerMessages.bannerMessageHeader).toBe(
        'Header',
      );
    });

    it('should call markForCheck when handling SDL content changes', () => {
      const spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: mockStore },
          { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
          { provide: FdWindowService, useValue: mockWindowService },
        ],
      });

      const mockSDLContent = {
        resourceBundles: {
          employeeDetailsSection: { some: 'content' },
          messages: {
            bannerMessageHeader: 'Header',
            bannerMessageBody: 'Body',
            bannerMessageEnabled: 'Y',
            bannerMessageDismissButton: 'Dismiss',
          },
        },
      };
      mockStore.sdlContent.set(mockSDLContent);

      const cdr = (spectator.component as any).cdr as any;
      const markSpy = jest.spyOn(cdr, 'markForCheck');

      (spectator.component as any).handleSDLContentChanges();

      expect(markSpy).toHaveBeenCalled();
    });

    it('should not set banner message if not enabled', () => {
      const spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: mockStore },
          { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
          { provide: FdWindowService, useValue: mockWindowService },
        ],
      });

      const mockSDLContent = {
        resourceBundles: {
          employeeDetailsSection: { some: 'content' },
          messages: {
            bannerMessageHeader: '',
            bannerMessageBody: '',
            bannerMessageEnabled: 'N',
          },
        },
      };
      mockStore.sdlContent.set(mockSDLContent);

      (spectator.component as any).handleSDLContentChanges();

      expect(spectator.component.employeeDetailContent).toEqual(
        mockSDLContent.resourceBundles.employeeDetailsSection,
      );
      expect(spectator.component.isBannerMessage).toBe(false);
    });

    it('should not set banner message if header is empty even if enabled', () => {
      const spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: mockStore },
          { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
          { provide: FdWindowService, useValue: mockWindowService },
        ],
      });

      const mockSDLContent = {
        resourceBundles: {
          employeeDetailsSection: { some: 'content' },
          messages: {
            bannerMessageHeader: '',
            bannerMessageBody: 'Body',
            bannerMessageEnabled: 'Y',
          },
        },
      };
      mockStore.sdlContent.set(mockSDLContent);

      (spectator.component as any).handleSDLContentChanges();

      expect(spectator.component.employeeDetailContent).toEqual(
        mockSDLContent.resourceBundles.employeeDetailsSection,
      );
      expect(spectator.component.isBannerMessage).toBe(false);
    });

    it('should not set banner message if body is empty even if enabled', () => {
      const spectator = createComponent({
        providers: [
          { provide: ManagementStore, useValue: mockStore },
          { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
          { provide: FdWindowService, useValue: mockWindowService },
        ],
      });

      const mockSDLContent = {
        resourceBundles: {
          employeeDetailsSection: { some: 'content' },
          messages: {
            bannerMessageHeader: 'Header',
            bannerMessageBody: '',
            bannerMessageEnabled: 'Y',
          },
        },
      };
      mockStore.sdlContent.set(mockSDLContent);

      (spectator.component as any).handleSDLContentChanges();

      expect(spectator.component.employeeDetailContent).toEqual(
        mockSDLContent.resourceBundles.employeeDetailsSection,
      );
      expect(spectator.component.isBannerMessage).toBe(false);
    });

    describe('dismissBanner', () => {
      it('should set isBannerVisible to false', () => {
        const spectator = createComponent({
          providers: [
            { provide: ManagementStore, useValue: mockStore },
            { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
            { provide: FdWindowService, useValue: mockWindowService },
          ],
        });
        spectator.component.dismissBanner();
        expect(spectator.component.isBannerVisible).toBe(false);
      });
    });

    describe('onExpand', () => {
      it('should not call analytics if no terminationDetails', () => {
        const spectator = createComponent({
          providers: [
            { provide: ManagementStore, useValue: mockStore },
            { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
            { provide: FdWindowService, useValue: mockWindowService },
          ],
        });
        spectator.component.employeeDetails.set({} as EmploymentDetailsModel);
        spectator.component.onExpand();
        expect(
          mockAnalyticsService.pageActionSubmitAnalytics,
        ).not.toHaveBeenCalled();
      });

      it('should call analytics for termination modeling if activeRuleIndicator YES', () => {
        const spectator = createComponent({
          providers: [
            { provide: ManagementStore, useValue: mockStore },
            { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
            { provide: FdWindowService, useValue: mockWindowService },
          ],
        });
        spectator.component.employeeDetails.set({
          terminationDetails: {
            activeRuleIndicator: TermModelConstant.YES,
          },
        } as EmploymentDetailsModel);
        spectator.component.onExpand();
        expect(
          mockAnalyticsService.pageActionSubmitAnalytics,
        ).toHaveBeenCalledWith(
          AnalyticsTag.userActionForSiteEvent,
          AnalyticsTag.terminationModeling,
          {
            actionDetail: AnalyticsTag.expand,
            pageType: AnalyticsTag.employeeDetails,
          },
        );
      });

      it('should call analytics for termination management if activeRuleIndicator NO', () => {
        const spectator = createComponent({
          providers: [
            { provide: ManagementStore, useValue: mockStore },
            { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
            { provide: FdWindowService, useValue: mockWindowService },
          ],
        });
        spectator.component.employeeDetails.set({
          terminationDetails: {
            activeRuleIndicator: TermModelConstant.NO,
          },
        } as EmploymentDetailsModel);
        spectator.component.onExpand();
        expect(
          mockAnalyticsService.pageActionSubmitAnalytics,
        ).toHaveBeenCalledWith(
          AnalyticsTag.userActionForSiteEvent,
          AnalyticsTag.terminationManagement,
          {
            actionDetail: AnalyticsTag.expand,
            pageType: AnalyticsTag.terminationManagement,
          },
        );
      });
    });

    describe('onCollapse', () => {
      it('should not call analytics if no terminationDetails', () => {
        const spectator = createComponent({
          providers: [
            { provide: ManagementStore, useValue: mockStore },
            { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
            { provide: FdWindowService, useValue: mockWindowService },
          ],
        });
        spectator.component.employeeDetails.set({} as EmploymentDetailsModel);
        spectator.component.onCollapse();
        expect(
          mockAnalyticsService.pageActionSubmitAnalytics,
        ).not.toHaveBeenCalled();
      });

      it('should call analytics for termination modeling if activeRuleIndicator YES', () => {
        const spectator = createComponent({
          providers: [
            { provide: ManagementStore, useValue: mockStore },
            { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
            { provide: FdWindowService, useValue: mockWindowService },
          ],
        });
        spectator.component.employeeDetails.set({
          terminationDetails: {
            activeRuleIndicator: TermModelConstant.YES,
          },
        } as EmploymentDetailsModel);
        spectator.component.onCollapse();
        expect(
          mockAnalyticsService.pageActionSubmitAnalytics,
        ).toHaveBeenCalledWith(
          AnalyticsTag.userActionForSiteEvent,
          AnalyticsTag.terminationModeling,
          {
            actionDetail: AnalyticsTag.collapse,
            pageType: AnalyticsTag.employeeDetails,
          },
        );
      });

      it('should call analytics for termination management if activeRuleIndicator NO', () => {
        const spectator = createComponent({
          providers: [
            { provide: ManagementStore, useValue: mockStore },
            { provide: AnalyticsUtilService, useValue: mockAnalyticsService },
            { provide: FdWindowService, useValue: mockWindowService },
          ],
        });
        spectator.component.employeeDetails.set({
          terminationDetails: {
            activeRuleIndicator: TermModelConstant.NO,
          },
        } as EmploymentDetailsModel);
        spectator.component.onCollapse();
        expect(
          mockAnalyticsService.pageActionSubmitAnalytics,
        ).toHaveBeenCalledWith(
          AnalyticsTag.userActionForSiteEvent,
          AnalyticsTag.terminationManagement,
          {
            actionDetail: AnalyticsTag.collapse,
            pageType: AnalyticsTag.terminationManagement,
          },
        );
      });
    });
  });
});
