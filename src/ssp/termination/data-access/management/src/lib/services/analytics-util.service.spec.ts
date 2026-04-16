/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file Test file for analytics util service
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  SpectatorService,
  createServiceFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { SiteEvents } from '../models/commonAnalytics/SiteEvents';
import { AnalyticsModel } from '../models/commonAnalytics/AnalyticsModel';
import { AnalyticsTag, AnalyticsUtilService } from './analytics-util.service';
import {
  FdAnalyticsService,
  FdWindowService,
} from '@fmr-ap123285/angular-utils';
import { UtilityService } from './utility.service';
import { ErrorAnalytics } from '../models/commonAnalytics/ErrorAnalytics';

describe('AnalyticsUtilService', () => {
  let spectator: SpectatorService<AnalyticsUtilService>;
  const createService = createServiceFactory({
    service: AnalyticsUtilService,
    mocks: [FdAnalyticsService, FdWindowService],
    providers: [
      mockProvider(UtilityService, {
        isStringNotEmpty: jest.fn(
          (str: string | null | undefined) =>
            str !== null && str !== undefined && str.trim() !== '',
        ),
      }),
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockWindow: Window = <any>{
    config: { pageContextUser: 'plansponsor' },

    ensightenDataSurface: { page_type: 'termination model' },
  };

  beforeEach(() => (spectator = createService()));

  beforeEach(() => {
    spectator.inject(FdWindowService).getWindow.mockReturnValue(mockWindow);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should submit the page view analytics', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageViewSubmitAnalytics('term modeling:{status}', {
      pageStatus: 'no result',
    });

    const analyticsModel: AnalyticsModel = {};
    const siteEvents: SiteEvents = {};
    siteEvents['spa_page_view'] = true;
    analyticsModel.site_events = siteEvents;
    analyticsModel.site_hierarchy = [
      AnalyticsTag.psw,
      AnalyticsTag.participant,
      AnalyticsTag.sps,
      'term modeling:no result',
    ];
    analyticsModel.action_type = AnalyticsTag.pageView;
    analyticsModel.application_type = 'sps participant termination';
    analyticsModel.capability = 'participant';
    analyticsModel.sub_capability = 'participant|data';

    expect(fdAnalytics).toHaveBeenCalledTimes(1);
    expect(fdAnalytics).toHaveBeenCalledWith(analyticsModel);
  });

  it('should submit the action view analytics or event', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());

    spectator.service.pageActionSubmitAnalytics(
      AnalyticsTag.userActionForSiteEvent,
      AnalyticsTag.terminationModeling,
      {
        actionDetail: AnalyticsTag.expand,
        pageType: AnalyticsTag.employeeDetails,
      },
    );

    const analyticsModel: AnalyticsModel = {};
    const siteEvents: SiteEvents = {};

    siteEvents['user_action'] = true;
    analyticsModel.action_detail = 'employee details:expand';
    analyticsModel.event_name = 'user action:employee details:expand';
    analyticsModel.site_events = siteEvents;
    analyticsModel.application_type = 'sps participant termination';
    analyticsModel.capability = 'participant';
    analyticsModel.sub_capability = 'participant|data';

    expect(fdAnalytics).toHaveBeenCalledTimes(1);
    expect(fdAnalytics).toHaveBeenCalledWith(analyticsModel);
  });

  it('should submit the action view analytics or event', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());

    spectator.service.pageActionSubmitAnalytics(
      AnalyticsTag.userActionForSiteEvent,
      AnalyticsTag.terminationModeling,
      { actionDetail: AnalyticsTag.expand, pageType: AnalyticsTag.modeling },
    );

    const analyticsModel: AnalyticsModel = {};
    const siteEvents: SiteEvents = {};

    siteEvents['user_action'] = true;
    analyticsModel.action_detail = 'modeling:expand';
    analyticsModel.event_name = 'user action:modeling:expand';
    analyticsModel.site_events = siteEvents;
    analyticsModel.application_type = 'sps participant termination';
    analyticsModel.capability = 'participant';
    analyticsModel.sub_capability = 'participant|data';

    expect(fdAnalytics).toHaveBeenCalledTimes(1);
    expect(fdAnalytics).toHaveBeenCalledWith(analyticsModel);
  });

  it('should submit the action with error', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    const errorAnalyticsArray: ErrorAnalytics[] = [];
    const errorAnalytics: ErrorAnalytics = {};
    errorAnalytics.field_name = AnalyticsTag.export + AnalyticsTag.toExcel;
    errorAnalytics.error_message = AnalyticsTag.systemError;
    errorAnalyticsArray.push(errorAnalytics);
    spectator.service.pageActionSubmitAnalytics(
      AnalyticsTag.userActionForSiteEvent,
      AnalyticsTag.terminationModeling,
      {
        actionDetail: AnalyticsTag.error,
        pageType: AnalyticsTag.export + AnalyticsTag.toExcel,
        errorAnalyticsArray: errorAnalyticsArray,
      },
    );

    const analyticsModel: AnalyticsModel = {};
    const siteEvents: SiteEvents = {};

    siteEvents['user_action'] = true;
    analyticsModel.action_detail = 'export to excel:error';
    analyticsModel.event_name = 'user action:export to excel:error';
    analyticsModel.site_events = siteEvents;
    analyticsModel.application_type = 'sps participant termination';
    analyticsModel.capability = 'participant';
    analyticsModel.sub_capability = 'participant|data';

    errorAnalytics.field_name = AnalyticsTag.export + AnalyticsTag.toExcel;
    errorAnalytics.error_message = AnalyticsTag.systemError;
    errorAnalyticsArray.push(errorAnalytics);
    analyticsModel.errors = errorAnalyticsArray;

    expect(fdAnalytics).toHaveBeenCalledTimes(1);
    expect(fdAnalytics).toHaveBeenCalledWith(analyticsModel);
  });

  it('should set form_error event when formName and errorAnalyticsArray are provided (lines 163-170)', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    const errorAnalyticsArray: ErrorAnalytics[] = [];
    const errorAnalytics: ErrorAnalytics = {};
    errorAnalytics.field_name = 'test field';
    errorAnalytics.error_message = 'test error';
    errorAnalyticsArray.push(errorAnalytics);
    spectator.service.pageActionSubmitAnalytics('test_event', 'modeling', {
      formName: 'test form',
      errorAnalyticsArray: errorAnalyticsArray,
    });

    const analyticsModel: AnalyticsModel = {};
    const siteEvents: SiteEvents = {};

    siteEvents['form_error'] = true;
    analyticsModel.form_name = 'test form';
    analyticsModel.errors = errorAnalyticsArray;
    analyticsModel.event_name = AnalyticsTag.formError;
    analyticsModel.site_events = siteEvents;
    analyticsModel.application_type = 'sps participant termination';
    analyticsModel.capability = 'participant';
    analyticsModel.sub_capability = 'participant|data';

    expect(fdAnalytics).toHaveBeenCalledTimes(1);
    expect(fdAnalytics).toHaveBeenCalledWith(analyticsModel);
  });

  it('should call fdAnalyticsService when tagging exit link for term modeling', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());

    spectator.service.tagExitLink('test1', 'test2', 'modeling');
    const expectedResult = {
      site_events: {
        exit_link: true,
      },
      exit_link_url: 'test1',
      exit_link_title: 'test2',
      event_name: 'exit link',
      application_type: 'sps participant termination',
      capability: 'participant',
      sub_capability: 'participant|data',
    };

    expect(fdAnalytics).toHaveBeenCalledTimes(1);
    expect(fdAnalytics).toHaveBeenCalledWith(expectedResult);
  });

  it('should call fdAnalyticsService when tagging exit link for term management', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());

    spectator.service.tagExitLink('test1', 'test2', 'management');
    const expectedResult = {
      site_events: {
        exit_link: true,
      },
      exit_link_url: 'test1',
      exit_link_title: 'test2',
      event_name: 'exit link',
      application_type: 'termination management',
      capability: 'participant',
      sub_capability: 'participant|data',
    };

    expect(fdAnalytics).toHaveBeenCalledTimes(1);
    expect(fdAnalytics).toHaveBeenCalledWith(expectedResult);
  });

  it('should call fdAnalyticsService when tagging exit link with blank application type', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());

    spectator.service.tagExitLink('test1', 'test2', '');
    const expectedResult = {
      site_events: {
        exit_link: true,
      },
      exit_link_url: 'test1',
      exit_link_title: 'test2',
      event_name: 'exit link',
      application_type: 'sps participant termination',
      capability: 'participant',
      sub_capability: 'participant|data',
    };

    expect(fdAnalytics).toHaveBeenCalledTimes(1);
    expect(fdAnalytics).toHaveBeenCalledWith(expectedResult);
  });

  // Additional tests to cover specific lines
  it('should construct analytics message with status replacement (line 118)', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageViewSubmitAnalytics('Page {status}', {
      pageStatus: 'loaded',
    });

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        site_hierarchy: expect.arrayContaining(['Page loaded']),
      }),
    );
  });

  it('should set view_name when viewName is provided', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageViewSubmitAnalytics('Test Page', {
      viewName: 'TestView',
    });

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        view_name: 'TestView',
      }),
    );
  });

  it('should not set application_type when pageType does not include modeling or management', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageViewSubmitAnalytics('other page type', {});

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.not.objectContaining({
        application_type: expect.any(String),
      }),
    );
  });

  it('should set site_hierarchy correctly (line 125)', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageViewSubmitAnalytics('Test Page', {});

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        site_hierarchy: ['psw', 'participant', 'sps', 'Test Page'],
      }),
    );
  });

  it('should use pageContextUser from window config (line 128)', () => {
    spectator.inject(FdWindowService).getWindow.mockReturnValue({
      config: { pageContextUser: 'spark' },
    } as Window & { config: { pageContextUser: string } });
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageViewSubmitAnalytics('Test Page', {});

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        site_hierarchy: ['spark', 'participant', 'sps', 'Test Page'],
      }),
    );
  });

  it('should set action_detail and event_name when actionDetail is provided (lines 167-170)', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageActionSubmitAnalytics('test_event', 'modeling', {
      actionDetail: 'click',
      pageType: 'home',
    });

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        action_detail: 'home:click',
        event_name: 'user action:home:click',
        site_events: { test_event: true },
      }),
    );
  });

  it('should not set action_detail and event_name when actionDetail is empty', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageActionSubmitAnalytics('test_event', 'modeling', {
      actionDetail: '',
      pageType: 'home',
    });

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.not.objectContaining({
        action_detail: expect.any(String),
        event_name: expect.any(String),
      }),
    );
  });

  it('should set application_type for modeling (lines 187-188)', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageActionSubmitAnalytics(
      'test_event',
      'some modeling type',
      {},
    );

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        application_type: 'sps participant termination',
      }),
    );
  });

  it('should not set application_type when applicationType does not include modeling or management', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageActionSubmitAnalytics('test_event', 'other type', {});

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.not.objectContaining({
        application_type: expect.any(String),
      }),
    );
  });

  it('should default appType to spsParticipantTermination in tagExitLink (line 236)', () => {
    const fdAnalytics = spectator.inject(FdAnalyticsService);
    fdAnalytics.submitAnalytics.mockReturnValue(void 0);
    spectator.service.tagExitLink('url', 'title', 'default');

    expect(fdAnalytics.submitAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        application_type: 'sps participant termination',
      }),
    );
  });

  it('should set application_type for management in pageViewSubmitAnalytics', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageViewSubmitAnalytics('some management type', {});

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        application_type: 'termination management',
      }),
    );
  });

  it('should set application_type for management in pageActionSubmitAnalytics', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageActionSubmitAnalytics(
      'test_event',
      'termination management',
      {},
    );

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        application_type: 'termination management',
      }),
    );
  });

  it('should construct analytics message without status replacement', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageViewSubmitAnalytics('Page without status', {});

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        site_hierarchy: expect.arrayContaining(['Page without status']),
      }),
    );
  });

  it('should set site_hierarchy with undefined when pageContextUser is not in map (line 125)', () => {
    spectator.inject(FdWindowService).getWindow.mockReturnValue({
      config: { pageContextUser: 'unknown' },
    } as Window & { config: { pageContextUser: string } });
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageViewSubmitAnalytics('Test Page', {});

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        site_hierarchy: [undefined, 'participant', 'sps', 'Test Page'],
      }),
    );
  });

  it('should set action_detail with undefined pageType (lines 167-170)', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageActionSubmitAnalytics('test_event', 'modeling', {
      actionDetail: 'click',
      // pageType not provided
    });

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        action_detail: 'undefined:click',
        event_name: 'user action:undefined:click',
      }),
    );
  });

  it('should set action_detail with different values (lines 167-170)', () => {
    const fdAnalytics = jest
      .spyOn(spectator.inject(FdAnalyticsService), 'submitAnalytics')
      .mockImplementationOnce(jest.fn());
    spectator.service.pageActionSubmitAnalytics('another_event', 'modeling', {
      actionDetail: 'submit',
      pageType: 'form',
    });

    expect(fdAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        action_detail: 'form:submit',
        event_name: 'user action:form:submit',
        site_events: { another_event: true },
      }),
    );
  });
});
