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

import { TerminationsRootService } from './terminations-root.service';
import { TerminationsRoot } from './terminations-root.model';

type TerminationsRootState = {
  data: TerminationsRoot[];
};

const initialState = {
  data: [],
};

export const TerminationsRootStore = signalStore(
  { providedIn: 'root' },
  withState<TerminationsRootState>(initialState),
  withLoadingStatus(),
  withComputed(({ data }) => ({
    hasData: computed(() => data().length !== 0),
  })),
  withMethods(
    (store, terminationsRootListService = inject(TerminationsRootService)) => ({
      getRestData: rxMethod<void>(
        pipe(
          tap(() => patchState(store, setLoading())),
          switchMap(() => {
            return terminationsRootListService.getRestData().pipe(
              tapResponse({
                next: (res) =>
                  patchState(
                    store,
                    { data: res.terminationsRootList || [] },
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
  // withStateLogger('terminations-root'),
);
