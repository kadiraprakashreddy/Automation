import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { pipe, switchMap, tap } from 'rxjs';

import {
  setError,
  setLoading,
  setResolved,
  withLoadingStatus,
} from '@fmr-ap167419/shared-core-data-access-loading-status';
// Enable if you want to observe state changes for debugging purposes for local development
// Please comment this back out before committing
// import { withStateLogger } from '@fmr-ap167419/shared-core-data-access-state-logger';

import { TerminationsRootStore } from '@fmr-ap160368/sps-termination-data-access-terminations-root';
import { ManagementService } from './management.service';
import { Management } from './management.model';
import { SDLContentService } from './services/sdl-content/sdl-content.service';
import { ErrorHandlingUtils } from './utilities/error-handling-utils';
import { TermRuleIdsService } from './services/term-rule-ids/term-rule-ids.service';
import { EmploymentDetailsService } from './services/employment-details/employment-details.service';
import { ISDLContent } from './models/sdl-resource-bundle.model';
import { TermRuleIdsModel } from './models/term-rule-ids.model';
import { EmploymentDetailsModel } from './models/employment-details.model';
import { FetchTermModelsService } from './services/fetch-term-model/fetch-term-models.service';
import { IAward } from './models/award.model';
import {
  TermModelConstant,
  TermModelStoreConstants,
} from './constants/term-model.constants';
import { ErrorMessage } from './models/common/error-models/ErrorMessage';
import {
  STATE,
  UpdateTerminationDetailsService,
} from './services/update-termination-details/update-termination-details.service';
import { ModifyTerminationsModel } from './models/modify-terminations.model';
import { TermModelExportService } from './services/term-model-export/term-model-export.service';

const MOCK_UPDATE_ERROR_CODE: string = 'F-WSDPER-SPTERM-001403';

type ManagementState = {
  data: Management[];
  sdlContent: ISDLContent | null;
  termRuleIds: TermRuleIdsModel | null;
  employmentDetails: EmploymentDetailsModel | null;
  termModels: IAward | null;
  errorMessage: ErrorMessage | null;
  fetchTermModelError: ErrorMessage | null;
  employmentDetailsError: ErrorMessage | null;
  terminationUpdateState: STATE | null;
  terminationUpdateError: ErrorMessage | null;
  csvExportError: ErrorMessage | null;
  exportInProgress: boolean;
};

const initialState = {
  data: [],
  sdlContent: null,
  termRuleIds: null,
  employmentDetails: null,
  termModels: null,
  errorMessage: null,
  fetchTermModelError: null,
  employmentDetailsError: null,
  terminationUpdateState: null,
  terminationUpdateError: null,
  csvExportError: null,
  exportInProgress: false,
};

export const ManagementStore = signalStore(
  { providedIn: 'root' },
  withState<ManagementState>(initialState),
  withLoadingStatus(),
  withProps(() => ({
    _managementListService: inject(ManagementService),
    sdlContentService: inject(SDLContentService),
    termRuleIdsService: inject(TermRuleIdsService),
    employmentDetailsService: inject(EmploymentDetailsService),
    fetchTermModelsService: inject(FetchTermModelsService),
    updateTerminationDetailsService: inject(UpdateTerminationDetailsService),
    termModelExportService: inject(TermModelExportService),
  })),
  withComputed(
    (
      {
        data,
        sdlContent,
        termRuleIds,
        employmentDetails,
        termModels,
        loadingStatusMap,
      },
      rootStore = inject(TerminationsRootStore),
    ) => ({
      hasData: computed(() => data().length !== 0),
      hasSDLContent: computed(() => sdlContent() !== null),
      hasTermRuleIds: computed(() => termRuleIds() !== null),
      hasEmploymentDetails: computed(() => employmentDetails() !== null),
      hasTermModels: computed(() => termModels() !== null),
      // Example of reflecting data from Root Feature
      rootData: rootStore.data,
      // Computed properties for link handling
      availableLinks: computed(() => {
        const details = employmentDetails();
        return details?.links || [];
      }),
      terminationUpdateUrl: computed(() => {
        const details = employmentDetails();
        if (!details?.links) return null;

        const updateLink = details.links.find(
          (link) => link.rel === TermModelConstant.UPDATE,
        );
        return updateLink?.href || null;
      }),
      isTerminationUpdateAllowed: computed(() => {
        const details = employmentDetails();
        if (!details?.links) return false;

        const updateLink = details.links.find(
          (link) => link.rel === TermModelConstant.UPDATE,
        );
        return !!updateLink?.href;
      }),
      isTerminationUpdating: computed(() => {
        const statusMap = loadingStatusMap();
        const status =
          statusMap[TermModelStoreConstants.TERMINATION_UPDATE_KEY];
        return status === 'loading';
      }),
      isTermModelsLoading: computed(() => {
        const statusMap = loadingStatusMap();
        return statusMap[TermModelStoreConstants.TERM_MODELS_KEY] === 'loading';
      }),
    }),
  ),
  withMethods(
    ({
      _managementListService,
      sdlContentService,
      termRuleIdsService,
      employmentDetailsService,
      fetchTermModelsService,
      updateTerminationDetailsService,
      termModelExportService,
      ...store
    }) => ({
      getRestData: rxMethod<void>(
        pipe(
          tap(() => patchState(store, setLoading())),
          switchMap(() => {
            return _managementListService.getRestData().pipe(
              tapResponse({
                next: (res) =>
                  patchState(
                    store,
                    { data: res.managementList || [] },
                    setResolved(),
                  ),
                error: () => patchState(store, setError('There was an error')),
              }),
            );
          }),
        ),
      ),
      loadSDLContent: rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, setLoading(TermModelStoreConstants.CONTENT_KEY)),
          ),
          switchMap(() => {
            return sdlContentService.fetchSDLContent().pipe(
              tapResponse({
                next: (content) =>
                  patchState(
                    store,
                    { sdlContent: content },
                    setResolved(TermModelStoreConstants.CONTENT_KEY),
                  ),
                error: (err?: HttpErrorResponse) => {
                  const errorMsg = ErrorHandlingUtils.getErrorMessage(err);
                  patchState(
                    store,
                    { errorMessage: errorMsg },
                    setError(
                      'Failed to load SDL content',
                      TermModelStoreConstants.CONTENT_KEY,
                    ),
                  );
                },
              }),
            );
          }),
        ),
      ),
      fetchTermRuleIds: rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, setLoading(TermModelStoreConstants.TERM_IDS_KEY)),
          ),
          switchMap(() => {
            return termRuleIdsService.fetchTermRuleIds().pipe(
              tapResponse({
                next: (termRuleIds) =>
                  patchState(
                    store,
                    { termRuleIds },
                    setResolved(TermModelStoreConstants.TERM_IDS_KEY),
                  ),
                error: (err?: HttpErrorResponse) => {
                  const errorMsg = ErrorHandlingUtils.getErrorMessage(err);
                  patchState(
                    store,
                    { errorMessage: errorMsg },
                    setError(
                      'Failed to load term rule IDs',
                      TermModelStoreConstants.TERM_IDS_KEY,
                    ),
                  );
                },
              }),
            );
          }),
        ),
      ),
      fetchEmployeeDetails: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(
              store,
              { employmentDetailsError: null },
              setLoading(TermModelStoreConstants.EMPLOYMENT_DETAILS_KEY),
            );
          }),
          switchMap(() => {
            return employmentDetailsService.fetchEmployeeDetails().pipe(
              tapResponse({
                next: (employmentDetails) => {
                  patchState(
                    store,
                    { employmentDetails },
                    setResolved(TermModelStoreConstants.EMPLOYMENT_DETAILS_KEY),
                  );
                },
                error: (err?: HttpErrorResponse) => {
                  const errorMsg = ErrorHandlingUtils.getErrorMessage(err);
                  patchState(
                    store,
                    { employmentDetailsError: errorMsg },
                    setError(
                      'Failed to load employment details',
                      TermModelStoreConstants.EMPLOYMENT_DETAILS_KEY,
                    ),
                  );
                },
              }),
            );
          }),
        ),
      ),
      fetchTermModel: rxMethod<
        [string | null | undefined, string | undefined, string | undefined]
      >(
        pipe(
          tap(() => {
            patchState(
              store,
              { fetchTermModelError: null, termModels: null },
              setLoading(TermModelStoreConstants.TERM_MODELS_KEY),
            );
          }),
          switchMap(([termModelUrl, termDate, termId]) => {
            return fetchTermModelsService
              .fetchTermModels(termModelUrl, termDate, termId)
              .pipe(
                tapResponse({
                  next: (termModels: IAward) =>
                    patchState(
                      store,
                      { termModels },
                      setResolved(TermModelStoreConstants.TERM_MODELS_KEY),
                    ),
                  error: (err: HttpErrorResponse) =>
                    patchState(
                      store,
                      {
                        fetchTermModelError:
                          ErrorHandlingUtils.getErrorMessage(err),
                      },
                      setError(
                        'Failed to fetch term model details',
                        TermModelStoreConstants.TERM_MODELS_KEY,
                      ),
                    ),
                }),
              );
          }),
        ),
      ),
      /**
       * Get URL for a given rel from employment details links
       *
       * @param rel - The relationship type to search for
       * @returns The href URL if found, null otherwise
       */
      getLink: (rel: string): string | null => {
        const details = store.employmentDetails();
        if (!details?.links) return null;

        const link = details.links.find((l) => l.rel === rel);
        return link?.href || null;
      },

      /**
       * Adjust termination details
       */
      adjustTerminationDetails: rxMethod<ModifyTerminationsModel>(
        pipe(
          tap(() => {
            patchState(
              store,
              { terminationUpdateError: null },
              setLoading(TermModelStoreConstants.TERMINATION_UPDATE_KEY),
            );
          }),
          switchMap((model) => {
            const updateUrl = store.terminationUpdateUrl();
            if (!updateUrl) {
              throw new Error('No termination update URL available');
            }
            return updateTerminationDetailsService
              .adjustTerminationDetails(model, updateUrl)
              .pipe(
                tapResponse({
                  next: (state) => {
                    patchState(
                      store,
                      { terminationUpdateState: state },
                      setResolved(
                        TermModelStoreConstants.TERMINATION_UPDATE_KEY,
                      ),
                    );
                  },
                  error: (err) => {
                    const httpErr = err as HttpErrorResponse;
                    let errorMsg: ErrorMessage;
                    if (
                      ErrorHandlingUtils.isErrorResponseWithRefCode(httpErr) &&
                      httpErr?.error.errors[0].code === MOCK_UPDATE_ERROR_CODE
                    ) {
                      errorMsg = ErrorHandlingUtils.getErrorMessage(
                        httpErr,
                        sdlContentService.resourceBundles.messages
                          .mockUpdateErrorTitle,
                        sdlContentService.resourceBundles.messages
                          .mockUpdateErrorBody,
                      );
                    } else {
                      errorMsg = ErrorHandlingUtils.getErrorMessage(
                        httpErr,
                        sdlContentService.resourceBundles.messages
                          .updateServiceFailureTitle,
                        sdlContentService.resourceBundles.messages
                          .updateServiceFailureBody,
                      );
                    }
                    patchState(
                      store,
                      { terminationUpdateError: errorMsg },
                      setError(
                        'Termination adjustment failed',
                        TermModelStoreConstants.TERMINATION_UPDATE_KEY,
                      ),
                    );
                  },
                }),
              );
          }),
        ),
      ),

      /**
       * Reverse termination details
       */
      reverseTerminationDetails: rxMethod<ModifyTerminationsModel>(
        pipe(
          tap(() => {
            patchState(
              store,
              { terminationUpdateError: null },
              setLoading(TermModelStoreConstants.TERMINATION_UPDATE_KEY),
            );
          }),
          switchMap((model) => {
            const updateUrl = store.terminationUpdateUrl();
            if (!updateUrl) {
              throw new Error('No termination update URL available');
            }
            return updateTerminationDetailsService
              .reverseTerminationDetails(model, updateUrl)
              .pipe(
                tapResponse({
                  next: (state) => {
                    patchState(
                      store,
                      { terminationUpdateState: state },
                      setResolved(
                        TermModelStoreConstants.TERMINATION_UPDATE_KEY,
                      ),
                    );
                  },
                  error: (err) => {
                    const httpErr = err as HttpErrorResponse;
                    let errorMsg: ErrorMessage;
                    if (
                      ErrorHandlingUtils.isErrorResponseWithRefCode(httpErr) &&
                      httpErr?.error.errors[0].code === MOCK_UPDATE_ERROR_CODE
                    ) {
                      errorMsg = ErrorHandlingUtils.getErrorMessage(
                        httpErr,
                        sdlContentService.resourceBundles.messages
                          .mockUpdateErrorTitle,
                        sdlContentService.resourceBundles.messages
                          .mockUpdateErrorBody,
                      );
                    } else {
                      errorMsg = ErrorHandlingUtils.getErrorMessage(httpErr);
                    }
                    patchState(
                      store,
                      { terminationUpdateError: errorMsg },
                      setError(
                        'Termination reversal failed',
                        TermModelStoreConstants.TERMINATION_UPDATE_KEY,
                      ),
                    );
                  },
                }),
              );
          }),
        ),
      ),

      /**
       * Export term models
       */
      exportTermModels: rxMethod<
        [
          string | null | undefined,
          string | undefined,
          string | undefined,
          boolean | undefined,
        ]
      >(
        pipe(
          tap(() =>
            patchState(store, { csvExportError: null, exportInProgress: true }),
          ),
          switchMap(([termModelUrl, termDate, termId, esppAvailable]) => {
            return termModelExportService
              .fetchExportTermModels(
                termModelUrl,
                termDate,
                termId,
                esppAvailable,
              )
              .pipe(
                tapResponse({
                  next: () => patchState(store, { exportInProgress: false }),
                  error: (err: HttpErrorResponse) => {
                    const errorMsg = ErrorHandlingUtils.getErrorMessage(err);
                    patchState(store, {
                      csvExportError: errorMsg,
                      exportInProgress: false,
                    });
                  },
                }),
              );
          }),
        ),
      ),
    }),
  ),
  withHooks({
    // Load data on store initialization
    // onInit: (store) => {
    //   store.getRestData();
    // },
  }),
  // Enable if you want to observe state changes for debugging purposes
  // withStateLogger('management'),
);
