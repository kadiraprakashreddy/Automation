import {
  RuleLevelOption,
  SchedulesCreateFormModel,
  SchedulesCreatePageContent,
  VestingMethodOption,
} from './schedules-create.model';

export const SCHEDULES_CREATE_PAGE_CONTENT: SchedulesCreatePageContent = {
  // Step 1: Termination rule level
  terminationCardHeader: 'Create a termination rule',
  terminationCardTitle: 'Step 1: Termination rule level',
  terminationCardDescription:
    'Choose how broadly the term rules should be applied.',
  terminationCardRequiredFieldsMessage: 'All fields are required.',
  equityAwardLabel: 'Equity award',
  equityAwardTooltipText:
    'Rules at this level apply broadly to an equity type; for example, to all restricted stock award (RSA) plans and products.',
  equityAwardSelectOneLabel: 'Choose an award',
  planIdLabel: 'Plan ID',
  planIdTooltipText: 'Rules apply more narrowly to a specific plan or plans.',
  productIdLabel: 'Product ID',
  productIdTooltipText:
    'The most granular level. Rules apply to specific products.',
  terminationRuleIdLabel: 'Termination rule ID',
  terminationRuleIdTooltipText:
    'A rule ID is a brief code of up to 10 letters or numbers that defines the underlying termination rule. Examples: VOL, INV, RET, DIS.',
  terminationRuleNameLabel: 'Termination rule name',
  // Step 2: Vesting method
  step2CardTitle: 'Step 2: Vesting method',
  step2CardDescription:
    'Choose how the awards should vest upon termination.',
  step2HelpLinkLabel: 'Need help understanding vesting methods?',
  step2HelpLinkHref: 'https://www.google.com',
  step2ValidationMessage: 'Select one of the above options.',
  step2NotEligibleProrationMsg: '(Not eligible for proration schedules.)',
  step2NotEligibleRSAMsg: '(Not eligible for RSA equity type.)',
  // Shared action labels
  terminationSaveAndExitLabel: 'Save and exit',
  terminationSaveAndContinueLabel: 'Save and continue',
  terminationCancelLabel: 'Cancel',
};

export const VESTING_METHOD_OPTIONS: VestingMethodOption[] = [
  {
    value: 'forfeit',
    title: 'Forfeit vesting',
    description: 'Cancel unvested or vested awards upon termination.',
  },
  {
    value: 'vestSome',
    title: 'Partial vesting',
    description: 'Vest some unvested awards upon termination.',
  },
  {
    value: 'defer',
    title: 'Defer vesting',
    description:
      'Defer the vesting dates and/or distribution dates of the award upon termination.',
  },
  {
    value: 'vestPerPlanRules',
    title: 'Continue vesting',
    description:
      'Continue to vest awards on their original schedule upon termination.',
  },
  {
    value: 'vestAccelerateAll',
    title: 'Immediate vesting',
    description: 'Vest all unvested awards upon termination.',
  },
];

export const SCHEDULES_CREATE_AUTOCOMPLETE_ITEMS = [
  { value: 'Test 1', label: 'Test 1' },
  { value: 'Test 2', label: 'Test 2' },
  { value: 'Test 3', label: 'Test 3' },
  { value: 'Test 4', label: 'Test 4' },
];

export const RULE_LEVEL_OPTIONS: RuleLevelOption[] = [
  {
    value: 'equity',
    title: 'Equity award level',
    description:
      'This applies the rule to all plans and products of your selected award. Choose this to save time and avoid creating rules for each product individually.',
  },
  {
    value: 'plan',
    title: 'Plan level',
    description:
      'This applies the rule to all products within a selected plan and award. Choose this to simplify rule creation for an entire plan.',
  },
  {
    value: 'product',
    title: 'Product level',
    description:
      'This applies the rule to specific products within a selected plan and award. Choose this to customize rules for products with different requirements.',
  },
];

export const EQUITY_AWARD_OPTIONS = [
  'Cash(CSH)',
  'Restricted Stock Awards(RSA)',
  'Restricted Stock Units(RSU)',
];

export const DEFAULT_SCHEDULE_CREATE_FORM: SchedulesCreateFormModel = {
  terminationEquityType: '',
  level: 'equity',
  terminationPlanId: '',
  terminationProductId: '',
  terminationRuleId: '',
  terminationRuleName: '',
};
