/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of award model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { IPlanDetail } from './plan-details.model';
import { ILink } from './common/error-models/Link';

/**
 *
 *
 * @export
 * @interface IAward
 */
export interface IAward {
  /**
   *
   * @type {string}
   * @memberof IAward
   */
  modeledDate: string;

  /**
   *
   * @type {IPlanDetail[]}
   * @memberof IAward
   */
  plans: IPlanDetail[];

  /**
   *
   * @type {boolean}
   * @memberof IAward
   */
  divisionalRestricted: boolean;

  /**
   *
   * @type {boolean}
   * @memberof IAward
   */
  partialDivisionalRestricted: boolean;

  /**
   *
   * @type {boolean}
   * @memberof IAward
   */
  noGrants: boolean;

  /**
   *
   *
   * @type {ILink}
   * @memberof IAward
   */
  links: ILink[] | null | undefined;
}
