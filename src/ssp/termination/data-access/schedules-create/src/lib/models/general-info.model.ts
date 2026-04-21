export type RuleLevel = 'equity' | 'plan' | 'product';

export interface RuleLevelOption {
  value: RuleLevel;
  title: string;
  description: string;
}

export interface GeneralInfoCreatePageContent {
  terminationCardTitle: string;
  terminationCardDescription: string;
  terminationCardRequiredFieldsMessage: string;
  equityAwardLabel: string;
  equityAwardTooltipText: string;
  equityAwardSelectOneLabel: string;
  planIdLabel: string;
  planIdTooltipText: string;
  productIdLabel: string;
  productIdTooltipText: string;
  terminationRuleIdLabel: string;
  terminationRuleIdTooltipText: string;
  terminationRuleNameLabel: string;
}

export interface GeneralInfoFormModel {
  terminationEquityType: string;
  level: RuleLevel;
  terminationPlanId: string;
  terminationProductId: string;
  terminationRuleId: string;
  terminationRuleName: string;
}
