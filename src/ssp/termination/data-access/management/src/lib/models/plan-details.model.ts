/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of plan details model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { IGrant } from './grant.model';
import { ITotalQuantity } from './total-quantity.model';

/**
 *
 *
 * @export
 * @interface IPlanDetail
 */
export interface IPlanDetail {
  /**
   *
   * @type {string}
   * @memberof IPlanDetail
   */
  planId: string;
  /**
   *
   * @type {string}
   * @memberof IPlanDetail
   */
  planType: string;
  /**
   *
   * @type {string}
   * @memberof IPlanDetail
   */
  currencyCode: string;
  /**
   *
   * @type {IGrant[]}
   * @memberof IPlanDetail
   */
  grants: IGrant[];
  /**
   *
   * @type {ITotalQuantity}
   * @memberof IPlanDetail
   */
  totalQuantity: ITotalQuantity;
}
