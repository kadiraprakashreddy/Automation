export type TermTypeValue =
  | 'vestPerPlanRules'
  | 'forfeit'
  | 'vestAccelerateAll'
  | 'vestSome'
  | 'defer';

export interface TermTypeOption {
  label: string;
  value: TermTypeValue;
}

export interface TermTypePageContent {
  terminationCardTitle: string;
  unvestedAwardsLabel: string;
}

export interface TermTypeFormModel {
  termType: TermTypeValue | null;
}
