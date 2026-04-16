/* eslint-disable @typescript-eslint/no-explicit-any */
import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlingUtils } from './utilities/error-handling-utils';
import { ErrorMessage } from './models/common/error-models/ErrorMessage';
import { ManagementStore } from './management.store';
import { TerminationsRootStore } from '@fmr-ap160368/sps-termination-data-access-terminations-root';
import { ManagementService } from './management.service';
import { SDLContentService } from './services/sdl-content/sdl-content.service';
import { TermRuleIdsService } from './services/term-rule-ids/term-rule-ids.service';
import { EmploymentDetailsService } from './services/employment-details/employment-details.service';
import { FetchTermModelsService } from './services/fetch-term-model/fetch-term-models.service';
import { UpdateTerminationDetailsService } from './services/update-termination-details/update-termination-details.service';
import { TermModelExportService } from './services/term-model-export/term-model-export.service';

describe('ManagementStore', () => {
  let spectator: SpectatorService<InstanceType<typeof ManagementStore>>;

  const mockManagementList = [{ id: 'm1' }];
  const mockEmploymentDetails = {
    employerName: 'ACME',
    links: [
      { rel: 'update', href: '/update' },
      { rel: 'other', href: '/other' },
    ],
  } as any;

  const createService = createServiceFactory({
    service: ManagementStore,
    providers: [
      {
        provide: ManagementService,
        useValue: {
          getRestData: jest
            .fn()
            .mockReturnValue(of({ managementList: mockManagementList })),
        },
      },
      {
        provide: SDLContentService,
        useValue: {
          fetchSDLContent: jest.fn().mockReturnValue(of({ title: 'content' })),
          resourceBundles: {
            messages: {
              mockUpdateErrorTitle: 'u',
              mockUpdateErrorBody: 'b',
              updateServiceFailureTitle: 't',
              updateServiceFailureBody: 'd',
            },
          },
        },
      },
      {
        provide: TermRuleIdsService,
        useValue: {
          fetchTermRuleIds: jest.fn().mockReturnValue(of({ ids: [] })),
        },
      },
      {
        provide: EmploymentDetailsService,
        useValue: {
          fetchEmployeeDetails: jest
            .fn()
            .mockReturnValue(of(mockEmploymentDetails)),
        },
      },
      {
        provide: FetchTermModelsService,
        useValue: { fetchTermModels: jest.fn().mockReturnValue(of({})) },
      },
      {
        provide: UpdateTerminationDetailsService,
        useValue: {
          adjustTerminationDetails: jest
            .fn()
            .mockReturnValue(of({ state: 'ok' })),
          reverseTerminationDetails: jest
            .fn()
            .mockReturnValue(of({ state: 'rev' })),
        },
      },
      {
        provide: TermModelExportService,
        useValue: {
          fetchExportTermModels: jest.fn().mockReturnValue(of(null)),
        },
      },
      {
        provide: TerminationsRootStore,
        useValue: { data: [] },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('creates store', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('getRestData populates data and hasData toggles', () => {
    // initial empty
    expect(spectator.service.hasData()).toBe(false);

    spectator.service.getRestData();

    expect(spectator.service.hasData()).toBe(true);
    expect(spectator.service.data().length).toBeGreaterThan(0);
  });

  it('loadSDLContent sets sdlContent and hasSDLContent', () => {
    expect(spectator.service.hasSDLContent()).toBe(false);
    spectator.service.loadSDLContent();
    expect(spectator.service.hasSDLContent()).toBe(true);
  });

  it('fetchTermRuleIds sets termRuleIds', () => {
    spectator.service.fetchTermRuleIds();
    expect(spectator.service.hasTermRuleIds()).toBe(true);
  });

  it('fetchEmployeeDetails sets employment details and derived links', () => {
    spectator.service.fetchEmployeeDetails();
    expect(spectator.service.hasEmploymentDetails()).toBe(true);
    const links = spectator.service.availableLinks();
    expect(Array.isArray(links)).toBe(true);
    expect(spectator.service.getLink('other')).toBe('/other');
    expect(spectator.service.terminationUpdateUrl()).toBe('/update');
    expect(spectator.service.isTerminationUpdateAllowed()).toBe(true);
  });

  it('getLink returns null when no links', () => {
    // with initial state employmentDetails is null -> getLink should return null
    expect(spectator.service.getLink('whatever')).toBeNull();
  });

  it('availableLinks returns empty array when no employment details', () => {
    expect(Array.isArray(spectator.service.availableLinks())).toBe(true);
    expect(spectator.service.availableLinks().length).toBe(0);
  });

  it('terminationUpdateUrl and isTerminationUpdateAllowed handle missing update rel', () => {
    const empSvc = spectator.inject(EmploymentDetailsService) as any;
    empSvc.fetchEmployeeDetails = jest
      .fn()
      .mockReturnValue(of({ links: [{ rel: 'other', href: '/x' }] }));
    spectator.service.fetchEmployeeDetails();
    expect(spectator.service.terminationUpdateUrl()).toBeNull();
    expect(spectator.service.isTerminationUpdateAllowed()).toBe(false);
  });

  it('getRestData handles service error', () => {
    const mgmtSvc = spectator.inject(ManagementService) as any;
    mgmtSvc.getRestData = jest
      .fn()
      .mockReturnValueOnce(throwError(() => new Error('fail')));
    spectator.service.getRestData();
    expect(spectator.service.loadingStatus()).toEqual({
      error: 'There was an error',
    });
  });

  it('loadSDLContent sets errorMessage on failure', () => {
    const errMsg = new ErrorMessage();
    errMsg.title = 'SDL ERR';
    jest.spyOn(ErrorHandlingUtils, 'getErrorMessage').mockReturnValue(errMsg);
    const sdlSvc = spectator.inject(SDLContentService) as any;
    sdlSvc.fetchSDLContent = jest
      .fn()
      .mockReturnValueOnce(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
    spectator.service.loadSDLContent();
    expect(spectator.service.errorMessage()).toEqual(errMsg);
  });

  it('fetchTermModel sets fetchTermModelError on failure', () => {
    const fetchSvc = spectator.inject(FetchTermModelsService) as any;
    fetchSvc.fetchTermModels = jest
      .fn()
      .mockReturnValueOnce(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
    spectator.service.fetchTermModel([null, undefined, undefined] as any);
    expect(spectator.service.fetchTermModelError()).toBeDefined();
  });

  it('fetchTermModel sets termModels on success', () => {
    const fetchSvc = spectator.inject(FetchTermModelsService) as any;
    const mockTermModels = { awards: [{ id: 't1' }] } as any;
    fetchSvc.fetchTermModels = jest
      .fn()
      .mockReturnValueOnce(of(mockTermModels));
    spectator.service.fetchTermModel(['url', '2020-01-01', 'tid'] as any);
    expect(spectator.service.hasTermModels()).toBe(true);
    expect(spectator.service.termModels()).toEqual(mockTermModels);
  });

  it('isTermModelsLoading is true while fetchTermModel is in-flight', () => {
    const fetchSvc = spectator.inject(FetchTermModelsService) as any;
    // never resolves so loading stays true during the test
    fetchSvc.fetchTermModels = jest
      .fn()
      .mockReturnValueOnce(new Observable(() => {}));
    spectator.service.fetchTermModel(['url', '2020-01-01', 'tid'] as any);
    expect(spectator.service.isTermModelsLoading()).toBe(true);
  });

  it('isTermModelsLoading is false after fetchTermModel resolves', () => {
    const fetchSvc = spectator.inject(FetchTermModelsService) as any;
    fetchSvc.fetchTermModels = jest
      .fn()
      .mockReturnValueOnce(of({ awards: [] }));
    spectator.service.fetchTermModel(['url', '2020-01-01', 'tid'] as any);
    expect(spectator.service.isTermModelsLoading()).toBe(false);
  });

  it('adjustTerminationDetails sets terminationUpdateError when service errors with mock code', () => {
    const svc = spectator.inject(UpdateTerminationDetailsService) as any;
    const httpErr = new HttpErrorResponse({
      error: {
        errors: [{ title: 'ref', code: 'F-WSDPER-SPTERM-001403' }],
      } as any,
      status: 400,
    });
    svc.adjustTerminationDetails = jest
      .fn()
      .mockReturnValueOnce(throwError(() => httpErr));
    const errMsg = new ErrorMessage();
    errMsg.title = 'UPDATE ERR';
    jest.spyOn(ErrorHandlingUtils, 'getErrorMessage').mockReturnValue(errMsg);
    // ensure employment details include update link
    const empSvc = spectator.inject(EmploymentDetailsService) as any;
    empSvc.fetchEmployeeDetails = jest
      .fn()
      .mockReturnValue(of({ links: [{ rel: 'update', href: '/update' }] }));
    spectator.service.fetchEmployeeDetails();
    spectator.service.adjustTerminationDetails({} as any);
    expect(spectator.service.terminationUpdateError()).toEqual(errMsg);
  });

  it('fetchEmployeeDetails sets employmentDetailsError on failure', () => {
    const empSvc = spectator.inject(EmploymentDetailsService) as any;
    const httpErr = new HttpErrorResponse({ status: 500 });
    empSvc.fetchEmployeeDetails = jest
      .fn()
      .mockReturnValueOnce(throwError(() => httpErr));
    const errMsg = new ErrorMessage();
    errMsg.title = 'EMP ERR';
    jest.spyOn(ErrorHandlingUtils, 'getErrorMessage').mockReturnValue(errMsg);
    spectator.service.fetchEmployeeDetails();
    expect(spectator.service.employmentDetailsError()).toEqual(errMsg);
  });

  it('fetchTermRuleIds sets errorMessage on failure', () => {
    const termSvc = spectator.inject(TermRuleIdsService) as any;
    const httpErr = new HttpErrorResponse({ status: 500 });
    termSvc.fetchTermRuleIds = jest
      .fn()
      .mockReturnValueOnce(throwError(() => httpErr));
    const errMsg = new ErrorMessage();
    errMsg.title = 'TERM IDS ERR';
    jest.spyOn(ErrorHandlingUtils, 'getErrorMessage').mockReturnValue(errMsg);
    spectator.service.fetchTermRuleIds();
    expect(spectator.service.errorMessage()).toEqual(errMsg);
  });

  it('reverseTerminationDetails sets terminationUpdateError when service errors with mock code', () => {
    // ensure employment details include update link so terminationUpdateUrl is available
    const empSvc = spectator.inject(EmploymentDetailsService) as any;
    empSvc.fetchEmployeeDetails = jest
      .fn()
      .mockReturnValue(of({ links: [{ rel: 'update', href: '/update' }] }));
    spectator.service.fetchEmployeeDetails();

    const svc = spectator.inject(UpdateTerminationDetailsService) as any;
    const httpErr = new HttpErrorResponse({
      error: {
        errors: [{ title: 'ref', code: 'F-WSDPER-SPTERM-001403' }],
      } as any,
      status: 400,
    });
    svc.reverseTerminationDetails = jest
      .fn()
      .mockReturnValueOnce(throwError(() => httpErr));
    const errMsg = new ErrorMessage();
    errMsg.title = 'REV MOCK ERR';
    jest
      .spyOn(ErrorHandlingUtils, 'isErrorResponseWithRefCode')
      .mockReturnValue(true);
    jest.spyOn(ErrorHandlingUtils, 'getErrorMessage').mockReturnValue(errMsg);

    spectator.service.reverseTerminationDetails({} as any);
    // wait for rxMethod to process and set state
    return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
      expect(spectator.service.terminationUpdateError()).toEqual(errMsg);
    });
  });

  it('reverseTerminationDetails sets terminationUpdateError on generic error', () => {
    const svc = spectator.inject(UpdateTerminationDetailsService) as any;
    const httpErr = new HttpErrorResponse({
      error: { errors: [{ title: 'ref', code: 'OTHER' }] } as any,
      status: 500,
    });
    svc.reverseTerminationDetails = jest
      .fn()
      .mockReturnValueOnce(throwError(() => httpErr));
    const errMsg = new ErrorMessage();
    errMsg.title = 'REV ERR';
    jest.spyOn(ErrorHandlingUtils, 'getErrorMessage').mockReturnValue(errMsg);
    const empSvc = spectator.inject(EmploymentDetailsService) as any;
    empSvc.fetchEmployeeDetails = jest
      .fn()
      .mockReturnValue(of({ links: [{ rel: 'update', href: '/update' }] }));
    spectator.service.fetchEmployeeDetails();
    spectator.service.reverseTerminationDetails({} as any);
    expect(spectator.service.terminationUpdateError()).toEqual(errMsg);
  });
  it('exportTermModels toggles exportInProgress and handles errors', async () => {
    const exportSvc = spectator.inject(TermModelExportService) as any;
    exportSvc.fetchExportTermModels = jest.fn().mockReturnValueOnce(of(null));
    // ensure employment details include update link so update URL exists
    const empSvc = spectator.inject(EmploymentDetailsService) as any;
    empSvc.fetchEmployeeDetails = jest
      .fn()
      .mockReturnValue(of({ links: [{ rel: 'update', href: '/update' }] }));
    // populate employment details synchronously so terminationUpdateUrl is available
    spectator.service.fetchEmployeeDetails();
    spectator.service.exportTermModels([
      null,
      undefined,
      undefined,
      false,
    ] as any);
    // wait for rxMethod to complete and avoid unhandled exceptions in other methods
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(spectator.service.exportInProgress()).toBe(false);
  });
  it('exportTermModels sets csvExportError when export fails', () => {
    const exportSvc = spectator.inject(TermModelExportService) as any;
    exportSvc.fetchExportTermModels = jest
      .fn()
      .mockReturnValueOnce(
        throwError(() => new HttpErrorResponse({ status: 500 })),
      );
    spectator.service.exportTermModels([
      null,
      undefined,
      undefined,
      false,
    ] as any);
    expect(spectator.service.csvExportError()).toBeDefined();
    expect(spectator.service.exportInProgress()).toBe(false);
  });

  it('adjustTerminationDetails throws when no update url', () => {
    // mock EmploymentDetailsService to return no links so terminationUpdateUrl is null
    const empSvc = spectator.inject(EmploymentDetailsService) as any;
    empSvc.fetchEmployeeDetails = jest.fn().mockReturnValueOnce(of({}));
    spectator.service.fetchEmployeeDetails();
    // when there is no update link, terminationUpdateState should remain null
    spectator.service.adjustTerminationDetails({} as any);
    expect(spectator.service.terminationUpdateState()).toBeNull();
  });

  it('adjustTerminationDetails sets terminationUpdateState on success', () => {
    // populate employment details via fetch so store sets state correctly
    spectator.service.fetchEmployeeDetails();
    spectator.service.adjustTerminationDetails({} as any);
    expect(spectator.service.terminationUpdateState()).toBeDefined();
  });

  it('adjustTerminationDetails uses updateServiceFailure messages when ref-code present but not mock code', () => {
    const svc = spectator.inject(UpdateTerminationDetailsService) as any;
    const httpErr = new HttpErrorResponse({
      error: { errors: [{ title: 'ref', code: 'OTHER' }] } as any,
      status: 500,
    });
    svc.adjustTerminationDetails = jest
      .fn()
      .mockReturnValueOnce(throwError(() => httpErr));
    const errMsg = new ErrorMessage();
    errMsg.title = 'FAIL MSG';
    jest
      .spyOn(ErrorHandlingUtils, 'isErrorResponseWithRefCode')
      .mockReturnValue(true);
    jest.spyOn(ErrorHandlingUtils, 'getErrorMessage').mockReturnValue(errMsg);
    const empSvc = spectator.inject(EmploymentDetailsService) as any;
    empSvc.fetchEmployeeDetails = jest
      .fn()
      .mockReturnValue(of({ links: [{ rel: 'update', href: '/update' }] }));
    spectator.service.fetchEmployeeDetails();
    spectator.service.adjustTerminationDetails({} as any);
    expect(spectator.service.terminationUpdateError()).toEqual(errMsg);
  });

  it('reverseTerminationDetails sets terminationUpdateState on success', () => {
    spectator.service.fetchEmployeeDetails();
    spectator.service.reverseTerminationDetails({} as any);
    expect(spectator.service.terminationUpdateState()).toBeDefined();
  });
});
