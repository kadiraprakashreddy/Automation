/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of Xtrac Details model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

export class XtracDetailsModel {
  /**
   *
   *
   * @type {string}
   * @memberof XtracDetailsModel
   */
  xtracId: string;
  /**
   *
   *
   * @type {string}
   * @memberof XtracDetailsModel
   */
  xtracComments: string;

  /**
   * Creates an instance of XtracDetailsModel.
   *
   * @param xtracId
   * @param xtracComments
   * @memberof XtracDetailsModel
   */
  constructor(xtracId: string, xtracComments: string) {
    this.xtracId = xtracId;
    this.xtracComments = xtracComments;
  }
}
