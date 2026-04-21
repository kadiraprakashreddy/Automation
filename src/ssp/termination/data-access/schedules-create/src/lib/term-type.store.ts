import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DEFAULT_TERM_TYPE_FORM } from './constants/term-type.constants';
import { TermTypeFormModel, TermTypeValue } from './models/term-type.model';
import { GeneralInfoStore } from './general-info.store';

type TermTypeState = {
  formState: TermTypeFormModel;
};

const initialState: TermTypeState = {
  formState: { ...DEFAULT_TERM_TYPE_FORM },
};

export const TermTypeStore = signalStore(
  { providedIn: 'root' },
  withState<TermTypeState>(initialState),
  withComputed((store, generalInfoStore = inject(GeneralInfoStore)) => ({
    isRSA: computed(() =>
      generalInfoStore.formState().terminationEquityType.includes('RSA'),
    ),
    disabledTermTypeOptions: computed(() => ({
      vestPerPlanRules: false,
      forfeit: false,
      vestAccelerateAll: false,
      vestSome: false,
      defer: generalInfoStore.formState().terminationEquityType.includes('RSA'),
    })),
  })),
  withMethods((store, generalInfoStore = inject(GeneralInfoStore)) => ({
    setTermType: (value: TermTypeValue): void => {
      if (
        value === 'defer' &&
        generalInfoStore.formState().terminationEquityType.includes('RSA')
      ) {
        return;
      }
      patchState(store, {
        formState: { ...store.formState(), termType: value },
      });
    },
    resetForm: (): void => {
      patchState(store, {
        formState: { ...DEFAULT_TERM_TYPE_FORM },
      });
    },
  })),
);
