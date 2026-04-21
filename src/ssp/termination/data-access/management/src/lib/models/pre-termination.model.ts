/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of pre termination model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { ITermination } from './termination.model';

/**
 *
 *
 * @export
 * @interface IPreTermination
 * @extends {ITermination}
 */
export interface IPreTermination extends ITermination {
  /**
   *
   *
   * @type {number}
   * @memberof IPreTermination
   */
  outstandingQuantity: number;

  /**
   *
   *
   * @type {number}
   * @memberof IPreTermination
   */
  exercisableQuantity: number;

  /**
   *
   *
   * @type {number}
   * @memberof IPreTermination
   */
  unvestedQuantity: number;
}
