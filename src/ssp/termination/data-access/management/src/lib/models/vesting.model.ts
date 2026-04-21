/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of Vesting model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { IPreTermination } from './pre-termination.model';
import { IPostTermination } from './post-termination.model';

/**
 *
 *
 * @export
 * @interface IVesting
 */
export interface IVesting {
  /**
   *
   *
   * @type {IPreTermination}
   * @memberof IVesting
   */
  preTerminationVesting: IPreTermination;

  /**
   *
   *
   * @type {IPreTermination}
   * @memberof IVesting
   */
  postTerminationVesting: IPostTermination;
}
