/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of grant model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { IVesting } from './vesting.model';

/**
 *
 *
 * @export
 * @interface IGrant
 */
export interface IGrant {
  /**
   *
   * @type {string}
   * @memberof IGrant
   */
  productId: string;

  /**
   *
   * @type {string}
   * @memberof IGrant
   */
  grantType: string;

  /**
   *
   * @type {string}
   * @memberof IGrant
   */
  grantId: string;

  /**
   *
   * @type {string}
   * @memberof IGrant
   */
  quantity: number;

  /**
   *
   * @type {string}
   * @memberof IGrant
   */
  grantPrice: number;

  /**
   *
   * @type {string}
   * @memberof IGrant
   */
  issuedDate: string;

  /**
   *
   * @type {boolean}
   * @memberof IGrant
   */
  performanceIndicator: boolean;

  /**
   *
   * @type {string}
   * @memberof IGrant
   */
  ruleIndicator?: string;

  /**
   *
   * @type {boolean}
   * @memberof IGrant
   */
  csrIndicator: boolean;

  /**
   *
   * @type {boolean}
   * @memberof IGrant
   */
  isoRulesOverride: boolean;

  /**
   *
   * @type {string}
   * @memberof IGrant
   */
  isoDays: string;
  /**
   *
   * @type {string}
   * @memberof IGrant
   */
  isoMonths: string;
  /**
   *
   * @type {IVesting[]}
   * @memberof IGrant
   */
  vestings: IVesting[];
}
