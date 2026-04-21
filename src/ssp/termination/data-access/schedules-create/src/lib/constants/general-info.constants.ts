import {
  GeneralInfoCreatePageContent,
  GeneralInfoFormModel,
  RuleLevelOption,
} from '../models/general-info.model';

export const GENERAL_INFO_PAGE_CONTENT: GeneralInfoCreatePageContent = {
  terminationCardTitle: 'Termination rule level',
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
    'A termination ID is a brief code of up to 10 letters or numbers that defines the underlying termination rule. Examples: VOL, INV, RET, DIS.',
  terminationRuleNameLabel: 'Termination rule name',
};

export const GENERAL_INFO_AUTOCOMPLETE_ITEMS = [
  { value: 'Test 1', label: 'Test 1' },
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

export const DEFAULT_GENERAL_INFO_FORM: GeneralInfoFormModel = {
  terminationEquityType: '',
  level: 'equity',
  terminationPlanId: '',
  terminationProductId: '',
  terminationRuleId: '',
  terminationRuleName: '',
};
