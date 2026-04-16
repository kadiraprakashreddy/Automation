/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of Award Table  model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

export interface ITableHeaders {
  retainedColumnLabel: string;
  outstandingColumnLabel: string;
  forfeitedColumnLabel: string;
  retainUnvestedColumnLabel?: string;
  retainedExercisableQuantityColumnLabel?: string;
  exercisableQuantityColumnLabel?: string;
  unvestedQuantityColumnLabel?: string;
}

export interface IModelTable {
  totalLabel: string;
  preTerminationUnvestedLabel: string;
  preTerminationsectionLabel: string;
  statusColumnLabel: string;
  postTerminationsectionLabel: string;
  postTermEstimateLabel: string;
  vestingDateColumnLabel: string;
  grantDetailsColumnLabel: string;
  grantDetailsProductIdLabel: string;
  grantDetailsGrantIdLabel: string;
  grantDetailsGrantedValueLabel: string;
  grantDetailsGrantDateLabel: string;
  preTerminationSopSarLabel: string;
  grantsCountLabel: string;
  grantCountLabel: string;
  grantTypeLabel?: string;
  grantPriceLabel?: string;
  expirationDateLabel?: string;
  terminationOutcomeLabel?: string;
}

export interface IModelResult {
  sectionHeader: string;
  asOfDate: string;
  exportExcel: string;
}

export interface IPerfFootnotes {
  footNotesContent: string;
}
