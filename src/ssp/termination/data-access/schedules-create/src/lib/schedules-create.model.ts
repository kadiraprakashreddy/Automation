export type RuleLevel = 'equity' | 'plan' | 'product';

export interface RuleLevelOption {
  value: RuleLevel;
  title: string;
  description: string;
}

export type VestingMethod =
  | 'forfeit'
  | 'vestSome'
  | 'vestAccelerateAll'
  | 'vestPerPlanRules'
  | 'defer';

export interface VestingMethodOption {
  value: VestingMethod;
  title: string;
  description: string;
}

export interface SchedulesCreatePageContent {
  // Step 1: Termination rule level
  terminationCardHeader: string;
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
  // Step 2: Vesting method
  step2CardTitle: string;
  step2CardDescription: string;
  step2HelpLinkLabel: string;
  /** Target URL for the Step 2 “need help” link (FDS `wi-ds-link` expects a normal href, not sprite IDs). */
  step2HelpLinkHref: string;
  step2ValidationMessage: string;
  step2NotEligibleProrationMsg: string;
  step2NotEligibleRSAMsg: string;
  // Shared action labels
  terminationSaveAndExitLabel: string;
  terminationSaveAndContinueLabel: string;
  terminationCancelLabel: string;
}

export interface SchedulesCreateFormModel {
  terminationEquityType: string;
  level: RuleLevel;
  terminationPlanId: string;
  terminationProductId: string;
  terminationRuleId: string;
  terminationRuleName: string;
}

export interface SchedulesCreate {
  id: string;
  name: string;
}

export interface SchedulesCreateRestResponse {
  schedulesCreateList: SchedulesCreate[];
}
