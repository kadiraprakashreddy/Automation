/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of Total Quantity model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

/**
 * @export
 * @interface ITotalQuantity
 */
export interface ITotalQuantity {
  /**
   * @type {number}
   * @memberof ITotalQuantity
   */
  outstandingQuantity: number;

  /**
   * @type {number}
   * @memberof IPreTermination
   */
  exercisableQuantity: number;

  /**
   * @type {number}
   * @memberof IPreTermination
   */
  unvestedQuantity: number;

  /**
   * @type {number}
   * @memberof ITotalQuantity
   */
  forfeitedQuantity: number;

  /**
   * @type {number}
   * @memberof ITotalQuantity
   */
  retainedQuantity: number;

  /**
   * @type {number}
   * @memberof ITotalQuantity
   */
  retainedExercisableQuantity: number;

  /**
   * @type {number}
   * @memberof ITotalQuantity
   */
  retainedUnvested: number;
}
