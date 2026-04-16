import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { pipe, switchMap, tap } from 'rxjs';

import {
  setError,
  setLoading,
  setResolved,
  withLoadingStatus,
} from '@fmr-ap167419/shared-core-data-access-loading-status';

import { TerminationsRootStore } from '@fmr-ap160368/sps-termination-data-access-terminations-root';
import { SchedulesCreateService } from './schedules-create.service';
import {
  SchedulesCreate,
  SchedulesCreateFormModel,
} from './schedules-create.model';
import { DEFAULT_SCHEDULE_CREATE_FORM } from './schedules-create.constants';

type SchedulesCreateState = {
  data: SchedulesCreate[];
  formState: SchedulesCreateFormModel;
};

const initialState: SchedulesCreateState = {
  data: [],
  formState: { ...DEFAULT_SCHEDULE_CREATE_FORM },
};

export const SchedulesCreateStore = signalStore(
  { providedIn: 'root' },
  withState<SchedulesCreateState>(initialState),
  withLoadingStatus(),
  withComputed(
    ({ data, formState }, rootStore = inject(TerminationsRootStore)) => ({
      hasData: computed(() => data().length !== 0),
      // Derived form state
      currentLevel: computed(() => formState().level),
      showsPlanField: computed(
        () => formState().level === 'plan' || formState().level === 'product',
      ),
      showsProductField: computed(() => formState().level === 'product'),
      // Example of reflecting data from Root Feature
      rootData: rootStore.data,
    }),
  ),
  withMethods(
    (store, schedulesCreateListService = inject(SchedulesCreateService)) => ({
      /**
       * Update form field state
       */
      updateFormField: (
        field: keyof SchedulesCreateFormModel,
        value: string,
      ) => {
        const currentForm = store.formState();
        patchState(store, {
          formState: { ...currentForm, [field]: value },
        });
      },

      /**
       * Handle rule level change and reset dependent fields
       */
      onLevelChange: (level: 'equity' | 'plan' | 'product') => {
        const currentForm = store.formState();
        const updatedForm: SchedulesCreateFormModel = {
          ...currentForm,
          level,
        };

        // Reset dependent fields based on level
        if (level === 'equity') {
          updatedForm.terminationPlanId = '';
          updatedForm.terminationProductId = '';
        } else if (level === 'plan') {
          updatedForm.terminationProductId = '';
        }

        patchState(store, { formState: updatedForm });
      },

      /**
       * Handle plan ID change and validate product ID
       */
      onPlanIdChange: () => {
        const currentForm = store.formState();
        const showsProduct = store.showsProductField();
        const updatedForm = { ...currentForm };

        if (!showsProduct) {
          updatedForm.terminationProductId = '';
        }

        patchState(store, { formState: updatedForm });
      },

      /**
       * Reset form to initial state
       */
      resetForm: () => {
        patchState(store, {
          formState: { ...DEFAULT_SCHEDULE_CREATE_FORM },
        });
      },

      /**
       * Fetch rest data (legacy support)
       */
      getRestData: rxMethod<void>(
        pipe(
          tap(() => patchState(store, setLoading())),
          switchMap(() => {
            return schedulesCreateListService.getRestData().pipe(
              tapResponse({
                next: (res) =>
                  patchState(
                    store,
                    { data: res.schedulesCreateList || [] },
                    setResolved(),
                  ),
                error: () => patchState(store, setError('There was an error')),
              }),
            );
          }),
        ),
      ),
    }),
  ),
  withHooks({
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    onInit(store) {
      store.getRestData();
    },
  }),
);
