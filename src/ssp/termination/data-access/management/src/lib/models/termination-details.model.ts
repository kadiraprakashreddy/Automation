/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of termination details model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

type StringNullType = string | null | undefined;

export class TerminationDetails {
  /**
   *
   *
   * @type {string}
   * @memberof ITerminationDetails
   */
  terminationDate: StringNullType;
  /**
   *
   *
   * @type {string}
   * @memberof ITerminationDetails
   */
  terminationId: StringNullType;
  /**
   *
   *
   * @type {boolean}
   * @memberof ITerminationDetails
   */
  terminationReversalIndicator: StringNullType;

  /**
   *
   *
   * @type {boolean}
   * @memberof ITerminationDetails
   */
  activeRuleIndicator: StringNullType;
  /**
   * Creates an instance of TerminationDetails.
   *
   * @param terminationDate
   * @param terminationId
   * @param terminationReversalIndicator
   * @param activeRuleIndicator
   * @memberof TerminationDetails
   */
  constructor(
    terminationDate: string | null,
    terminationId: string,
    terminationReversalIndicator: string,
    activeRuleIndicator: string,
  ) {
    this.terminationDate = terminationDate;
    this.terminationId = terminationId;
    this.terminationReversalIndicator = terminationReversalIndicator;
    this.activeRuleIndicator = activeRuleIndicator;
  }
}
