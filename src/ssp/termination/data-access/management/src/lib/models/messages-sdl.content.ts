/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of messages model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

export interface IMessages {
  invalidDate: string;
  terminationDateBeforeHireDate: string;
  terminationIdLimitReached: string;
  invalidTerminationId: string;
  noChangeInTerminationDetails: string;
  invalidXtracNumber: string;
  emptyTerminationId: string;
  updateServiceFailureTitle: string;
  updateServiceFailureBody: string;
  serviceErrorTitle: string;
  serviceErrorBody: string;
  mockUpdateErrorTitle: string;
  mockUpdateErrorBody: string;
  noTermDateCalculate: string;
  terminationDateBeforeTodaysDate: string;
  participantNotFound: string;
  noTermIDCalculate: string;
  noResultsFound: string;
  modelResultsPlanTypesInfo: string;
  datePlaceholder: string;
  modelResultsDateFormat: string;
  esppAvailableMessage: string;
  planDivSecurityInfo: string;
  partialPlanDivSecurityInfo: string;
  minHoldingRulelbl: string;
  minHoldingRuleMsg: string;
  noRuleAppliedlbl: string;
  noRuleAppliedMsg: string;
  existingTerminationlbl: string;
  existingTerminationMsg: string;
  termExclusionlbl: string;
  termExclusionMsg: string;
  noRuleContent: string;
  msgContent: string;
  labelContent: string;
  customSeperationRulelbl: string;
  customSeparationRuleInfoMsg: string;
  emptyCellScreenReaderTxt: string;
  spinnerMessageTxt: string;
  retainedExercisableQuantityMsg: string;
  exercisableQuantityMsg: string;
  importantLabel: string;
  isoMessageBoldText: string;
  isoMessage1: string;
  isoMessage2: string;
  isoVestImmediatelyMessage: string;
  isoProductIdMessage: string;
  productIdPlaceholder: string;
  monthsDaysPlaceholder: string;
  bannerMessageHeader: string;
  bannerMessageBody: string;
  bannerMessageDismissButton: string;
  bannerMessageEnabled: string;
}
