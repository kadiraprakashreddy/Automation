/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of post termination model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { ITermination } from './termination.model';

/**
 *
 *
 * @export
 * @interface IPostTermination
 * @extends {ITermination}
 */
export interface IPostTermination extends ITermination {
  /**
   *
   *
   * @type {number}
   * @memberof IPostTermination
   */
  forfeitedQuantity: number;

  /**
   *
   *
   * @type {number}
   * @memberof IPostTermination
   */
  retainedQuantity: number;

  /**
   *
   *
   * @type {number}
   * @memberof ITotalQuantity
   */
  retainedExercisableQuantity: number;

  /**
   *
   *
   * @type {number}
   * @memberof ITotalQuantity
   */
  retainedUnvested: number;

  /**
   *
   *
   * @type {number}
   * @memberof ITotalQuantity
   */
  retainedValue: number;
}
