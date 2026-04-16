/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of termination model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

/**
 * @export
 * @interface ITermination
 */
export interface ITermination {
  /**
   * @type {String}
   * @memberof ITermination
   */

  vestingDate: string;
  /**
   * @type {string}
   * @memberof ITermination
   */
  status: string;

  /**
   * @type {string}
   * @memberof ITermination
   */
  expirationDate: string;
}
