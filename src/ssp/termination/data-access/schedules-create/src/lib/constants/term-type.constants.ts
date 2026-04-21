import {
  TermTypeFormModel,
  TermTypeOption,
  TermTypePageContent,
} from '../models/term-type.model';

export const TERM_TYPE_PAGE_CONTENT: TermTypePageContent = {
  terminationCardTitle: 'Vesting method',
  unvestedAwardsLabel:
    'Select a vesting method',
};

export const TERM_TYPE_OPTIONS: TermTypeOption[] = [
  { label: 'Continue to original vesting', value: 'vestPerPlanRules' },
  { label: 'Vest/accelerate all awards', value: 'vestAccelerateAll' },
  { label: 'Partial vesting', value: 'vestSome' },
  { label: 'Defer vesting and/or distribution dates', value: 'defer' },
  { label: 'Forfeit awards', value: 'forfeit' }
  
  
  
];

export const DEFAULT_TERM_TYPE_FORM: TermTypeFormModel = {
  termType: null,
};
