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
// Enable if you want to observe state changes for debugging purposes for local development
// Please comment this back out before committing
// import { withStateLogger } from '@fmr-ap167419/shared-core-data-access-state-logger';

import { TerminationsRootStore } from '@fmr-ap160368/sps-termination-data-access-terminations-root';
import { SchedulesCreateService } from './schedules-create.service';
import { SchedulesCreate } from './schedules-create.model';

type SchedulesCreateState = {
  data: SchedulesCreate[];
};

const initialState = {
  data: [],
};

export const SchedulesCreateStore = signalStore(
  { providedIn: 'root' },
  withState<SchedulesCreateState>(initialState),
  withLoadingStatus(),
  withComputed(({ data }, rootStore = inject(TerminationsRootStore)) => ({
    hasData: computed(() => data().length !== 0),
    // Example of reflecting data from Root Feature
    rootData: rootStore.data,
  })),
  withMethods(
    (store, schedulesCreateListService = inject(SchedulesCreateService)) => ({
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
  // Enable if you want to observe state changes for debugging purposes
  // withStateLogger('schedules-create'),
);
