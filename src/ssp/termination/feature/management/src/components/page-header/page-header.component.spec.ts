/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file This file contains unit tests for page-header.component.ts
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import { SpsTerminationFeatureManagementPageHeaderComponent } from './page-header.component';
import {
  Spectator,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import {
  AnalyticsUtilService,
  EmploymentDetailsService,
  ManagementStore,
  ParticipantUI,
  SubmitAnalyticsService,
  TermRuleIdsService,
  vestingDetailsNotAvailable,
} from '@fmr-ap160368/sps-termination-data-access-management';
import { FdWindowService } from '@fmr-ap123285/angular-utils';

describe('SpsTerminationFeatureManagementPageHeaderComponent', () => {
  let spectator: Spectator<SpsTerminationFeatureManagementPageHeaderComponent>;
  let store: InstanceType<typeof ManagementStore>; // eslint-disable-line @typescript-eslint/no-unused-vars
  let analyticsUtilService: AnalyticsUtilService;
  let submitAnalyticsService: SubmitAnalyticsService;
  let participantUI: ParticipantUI;
  let windowService: FdWindowService;

  const createComponent = createComponentFactory({
    component: SpsTerminationFeatureManagementPageHeaderComponent,
    providers: [
      mockProvider(ManagementStore, {
        hasEmploymentDetails: () => true,
        getLink: jest.fn().mockReturnValue('video-link-url'),
        loadingStatus: jest.fn().mockReturnValue({}),
      }),
      mockProvider(AnalyticsUtilService),
      mockProvider(SubmitAnalyticsService),
      mockProvider(EmploymentDetailsService),
      mockProvider(TermRuleIdsService),
      mockProvider(ParticipantUI),
      mockProvider(FdWindowService, {
        getWindow: jest.fn().mockReturnValue({
          apis: { learnMoreLink: 'learn-more-url' },
          config: { pageContextUser: 'realm-value' },
          isTocV2Available: true,
          advancedlink: jest.fn(),
        }),
      }),
    ],
    detectChanges: false,
    shallow: true,
  });

  // no alternate factory — tests create their own component instances as needed

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    submitAnalyticsService = spectator.inject(SubmitAnalyticsService);
    participantUI = spectator.inject(ParticipantUI);
    windowService = spectator.inject(FdWindowService);

    analyticsUtilService.tagExitLink = jest.fn();
    submitAnalyticsService.submitAnalytics = jest.fn();

    spectator.setInput({
      content: {
        pageTitle: 'Manage termination', // Default to keep applicationType as 'Termination management'
        pageDescription: 'Test Description',
        termModelPageTitle: 'Term Model Title',
        termModelPageDescription: 'Term Model Description',
        termModelVideoLabel: 'Video Label',
        termModelVideoLength: '5 min',
        videoLinkURL: 'video-url',
        autocompleteWarningMessage: 'Warning',
      },
    });
    expect(spectator.component).toBeTruthy();
  });

  it('should initialize properties in ngOnInit', () => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    submitAnalyticsService = spectator.inject(SubmitAnalyticsService);
    participantUI = spectator.inject(ParticipantUI);
    windowService = spectator.inject(FdWindowService);

    analyticsUtilService.tagExitLink = jest.fn();
    submitAnalyticsService.submitAnalytics = jest.fn();

    spectator.setInput({
      content: {
        pageTitle: 'Manage termination',
        pageDescription: 'Test Description',
        termModelPageTitle: 'Term Model Title',
        termModelPageDescription: 'Term Model Description',
        termModelVideoLabel: 'Video Label',
        termModelVideoLength: '5 min',
        videoLinkURL: 'video-url',
        autocompleteWarningMessage: 'Warning',
      },
    });

    spectator.component.ngOnInit();

    expect(spectator.component.learnMoreLink).toBe('learn-more-url');
    expect(spectator.component.realm).toBe('realm-value');
    expect(spectator.component.isTocV2Available).toBe(true);
  });

  it('should set participantUI.shouldDisplayTermModels and applicationType when pageTitle is not manageTermination', () => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    submitAnalyticsService = spectator.inject(SubmitAnalyticsService);
    participantUI = spectator.inject(ParticipantUI);
    windowService = spectator.inject(FdWindowService);

    analyticsUtilService.tagExitLink = jest.fn();
    submitAnalyticsService.submitAnalytics = jest.fn();

    spectator.setInput({
      content: {
        pageTitle: 'Other Title',
        pageDescription: 'Desc',
        termModelPageTitle: 'Title',
        termModelPageDescription: 'Desc',
        termModelVideoLabel: 'Label',
        termModelVideoLength: 'Length',
        videoLinkURL: 'URL',
        autocompleteWarningMessage: 'Msg',
      },
    });
    spectator.component.ngOnInit();

    expect(participantUI.shouldDisplayTermModels).toBe(true);
  });

  it('should not set participantUI.shouldDisplayTermModels when pageTitle is manageTermination', () => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    submitAnalyticsService = spectator.inject(SubmitAnalyticsService);
    participantUI = spectator.inject(ParticipantUI);
    windowService = spectator.inject(FdWindowService);

    analyticsUtilService.tagExitLink = jest.fn();
    submitAnalyticsService.submitAnalytics = jest.fn();

    spectator.setInput({
      content: {
        pageTitle: 'Manage termination',
        pageDescription: 'Desc',
        termModelPageTitle: 'Title',
        termModelPageDescription: 'Desc',
        termModelVideoLabel: 'Label',
        termModelVideoLength: 'Length',
        videoLinkURL: 'URL',
        autocompleteWarningMessage: 'Msg',
      },
    });
    spectator.component.ngOnInit();

    expect(participantUI.shouldDisplayTermModels).toBeUndefined();
  });

  it('should set videoLinkURL in effect when store has employment details', () => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    submitAnalyticsService = spectator.inject(SubmitAnalyticsService);
    participantUI = spectator.inject(ParticipantUI);
    windowService = spectator.inject(FdWindowService);

    analyticsUtilService.tagExitLink = jest.fn();
    submitAnalyticsService.submitAnalytics = jest.fn();

    spectator.setInput({
      content: {
        pageTitle: 'Manage termination',
        pageDescription: 'Test Description',
        termModelPageTitle: 'Term Model Title',
        termModelPageDescription: 'Term Model Description',
        termModelVideoLabel: 'Video Label',
        termModelVideoLength: '5 min',
        videoLinkURL: 'video-url',
        autocompleteWarningMessage: 'Warning',
      },
    });
    spectator.detectChanges(); // Trigger the effect
    expect(spectator.component.videoLinkURL).toBe('video-link-url');
  });

  it('should call window.advancedlink and submitAnalytics in openLearnMoreLink', () => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    submitAnalyticsService = spectator.inject(SubmitAnalyticsService);
    participantUI = spectator.inject(ParticipantUI);
    windowService = spectator.inject(FdWindowService);

    analyticsUtilService.tagExitLink = jest.fn();
    submitAnalyticsService.submitAnalytics = jest.fn();

    spectator.setInput({
      content: {
        pageTitle: 'Manage termination',
        pageDescription: 'Test Description',
        termModelPageTitle: 'Term Model Title',
        termModelPageDescription: 'Term Model Description',
        termModelVideoLabel: 'Video Label',
        termModelVideoLength: '5 min',
        videoLinkURL: 'video-url',
        autocompleteWarningMessage: 'Warning',
      },
    });
    spectator.component.ngOnInit(); // Ensure learnMoreLink is set
    spectator.component.openLearnMoreLink();

    expect(windowService.getWindow().advancedlink).toHaveBeenCalledWith(
      'learn-more-url',
      '',
      '653x790',
      '',
    );
    expect(submitAnalyticsService.submitAnalytics).toHaveBeenCalledWith(
      'learn more',
    );
  });

  it('should call tagExitLink in tagVideoLink with default applicationType', () => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    submitAnalyticsService = spectator.inject(SubmitAnalyticsService);
    participantUI = spectator.inject(ParticipantUI);
    windowService = spectator.inject(FdWindowService);

    analyticsUtilService.tagExitLink = jest.fn();
    submitAnalyticsService.submitAnalytics = jest.fn();

    spectator.setInput({
      content: {
        pageTitle: 'Manage termination',
        pageDescription: 'Test Description',
        termModelPageTitle: 'Term Model Title',
        termModelPageDescription: 'Term Model Description',
        termModelVideoLabel: 'Video Label',
        termModelVideoLength: '5 min',
        videoLinkURL: 'video-url',
        autocompleteWarningMessage: 'Warning',
      },
    });
    spectator.detectChanges(); // Trigger the effect to set videoLinkURL
    spectator.component.tagVideoLink();

    expect(analyticsUtilService.tagExitLink).toHaveBeenCalledWith(
      'video-link-url',
      'Video Label',
      'Termination management',
    );
  });

  it('should call tagExitLink with Termination modeling when pageTitle is not manageTermination', () => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    submitAnalyticsService = spectator.inject(SubmitAnalyticsService);
    participantUI = spectator.inject(ParticipantUI);
    windowService = spectator.inject(FdWindowService);

    analyticsUtilService.tagExitLink = jest.fn();
    submitAnalyticsService.submitAnalytics = jest.fn();

    spectator.setInput({
      content: {
        pageTitle: 'Other Title',
        pageDescription: 'Desc',
        termModelPageTitle: 'Title',
        termModelPageDescription: 'Desc',
        termModelVideoLabel: 'Video Label', // Keep consistent
        termModelVideoLength: 'Length',
        videoLinkURL: 'URL',
        autocompleteWarningMessage: 'Msg',
      },
    });
    spectator.component.ngOnInit();
    spectator.detectChanges(); // Trigger the effect
    spectator.component.tagVideoLink();

    expect(analyticsUtilService.tagExitLink).toHaveBeenCalledWith(
      'video-link-url',
      'Video Label',
      'Termination modeling',
    );
  });

  it('should set empty videoLinkURL when store has no employment details', () => {
    const sp = createComponent({
      providers: [
        mockProvider(ManagementStore, {
          hasEmploymentDetails: () => false,
          getLink: jest.fn().mockReturnValue(null),
          loadingStatus: jest.fn().mockReturnValue({}),
        }),
        mockProvider(AnalyticsUtilService),
        mockProvider(SubmitAnalyticsService),
        mockProvider(EmploymentDetailsService),
        mockProvider(TermRuleIdsService),
        mockProvider(ParticipantUI),
        mockProvider(FdWindowService, {
          getWindow: jest.fn().mockReturnValue({
            apis: { learnMoreLink: 'lm' },
            config: { pageContextUser: 'r' },
            isTocV2Available: false,
            advancedlink: jest.fn(),
          }),
        }),
      ],
    });
    sp.detectChanges();
    expect(sp.component.videoLinkURL).toBe('');
  });

  it('tagVideoLink should handle missing content gracefully', () => {
    spectator = createComponent();
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    submitAnalyticsService = spectator.inject(SubmitAnalyticsService);
    analyticsUtilService.tagExitLink = jest.fn();
    submitAnalyticsService.submitAnalytics = jest.fn();
    // remove content input
    spectator.setInput({ content: undefined });
    spectator.detectChanges();
    // ensure applicationType is the default
    (spectator.component as any).applicationType = 'Termination management';
    spectator.component.tagVideoLink();
    expect(analyticsUtilService.tagExitLink).toHaveBeenCalledWith(
      spectator.component.videoLinkURL,
      '',
      'Termination management',
    );
  });

  it('should set participantUI.shouldDisplayTermModels when content is undefined', () => {
    spectator = createComponent();
    store = spectator.inject(ManagementStore);
    participantUI = spectator.inject(ParticipantUI);
    // do not set content
    spectator.setInput({ content: undefined });
    spectator.component.ngOnInit();
    expect(participantUI.shouldDisplayTermModels).toBe(true);
  });

  it('should not set participantUI.shouldDisplayTermModels when pageTitle matches vestingDetailsNotAvailable', () => {
    spectator = createComponent();
    participantUI = spectator.inject(ParticipantUI);
    spectator.setInput({
      content: {
        pageTitle: vestingDetailsNotAvailable.manageTermination,
      } as any,
    });
    spectator.component.ngOnInit();
    expect(participantUI.shouldDisplayTermModels).toBeUndefined();
  });

  it('tagVideoLink should use empty label when termModelVideoLabel missing', () => {
    spectator = createComponent();
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    analyticsUtilService.tagExitLink = jest.fn();
    spectator.setInput({
      content: {
        pageTitle: 'Manage termination',
        videoLinkURL: 'video-url',
      } as any,
    });
    spectator.detectChanges();
    spectator.component.tagVideoLink();
    expect(analyticsUtilService.tagExitLink).toHaveBeenCalledWith(
      spectator.component.videoLinkURL,
      '',
      'Termination management',
    );
  });

  it('openLearnMoreLink calls analytics even when learnMoreLink is empty', () => {
    const sp = createComponent({
      providers: [
        mockProvider(FdWindowService, {
          getWindow: jest.fn().mockReturnValue({
            apis: { learnMoreLink: '' },
            config: { pageContextUser: 'r' },
            isTocV2Available: true,
            advancedlink: jest.fn(),
          }),
        }),
      ],
    });
    const sub = sp.inject(SubmitAnalyticsService);
    (sub as any).submitAnalytics = jest.fn();
    sp.component.ngOnInit();
    sp.component.openLearnMoreLink();
    expect(sub.submitAnalytics).toHaveBeenCalledWith('learn more');
  });

  it('tagVideoLink respects manually-set applicationType', () => {
    spectator = createComponent();
    analyticsUtilService = spectator.inject(AnalyticsUtilService);
    analyticsUtilService.tagExitLink = jest.fn();
    spectator.setInput({
      content: {
        pageTitle: 'Manage termination',
        termModelVideoLabel: 'L',
        videoLinkURL: 'v',
      } as any,
    });
    spectator.detectChanges();
    (spectator.component as any).applicationType = 'CustomApp';
    spectator.component.tagVideoLink();
    expect(analyticsUtilService.tagExitLink).toHaveBeenCalledWith(
      spectator.component.videoLinkURL,
      'L',
      'CustomApp',
    );
  });
});
