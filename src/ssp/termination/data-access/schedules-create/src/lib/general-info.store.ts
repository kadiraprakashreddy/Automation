import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DEFAULT_GENERAL_INFO_FORM } from './constants/general-info.constants';
import { GeneralInfoFormModel } from './models/general-info.model';

type GeneralInfoState = {
  formState: GeneralInfoFormModel;
};

const initialState: GeneralInfoState = {
  formState: { ...DEFAULT_GENERAL_INFO_FORM },
};

export const GeneralInfoStore = signalStore(
  { providedIn: 'root' },
  withState<GeneralInfoState>(initialState),
  withComputed(({ formState }) => ({
    currentLevel: computed(() => formState().level),
    showsPlanField: computed(
      () => formState().level === 'plan' || formState().level === 'product',
    ),
    showsProductField: computed(() => formState().level === 'product'),
  })),
  withMethods((store) => ({
    /**
     * Update form field state
     */
    updateFormField: (field: keyof GeneralInfoFormModel, value: string) => {
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
      const updatedForm: GeneralInfoFormModel = {
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
        formState: { ...DEFAULT_GENERAL_INFO_FORM },
      });
    },
  })),
);
