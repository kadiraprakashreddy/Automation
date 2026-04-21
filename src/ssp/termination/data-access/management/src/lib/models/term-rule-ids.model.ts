/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of termination rule IDs model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

/**
 * @export
 * @interface ITermRuleIdsModel
 */
export class TermRuleIdsModel {
  /**
   * @type {string}
   * @memberof ITermRuleIdsModel
   */
  terminationRuleIds!: string[];

  /**
   * @type {boolean}
   * @memberof ITermRuleIdsModel
   */
  grkClient!: boolean;
}
