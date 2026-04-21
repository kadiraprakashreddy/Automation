/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of modify terminations model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { EmploymentDetailsModel } from '../models/employment-details.model';
import { XtracDetailsModel } from '../models/xtracDetails.model';

/**
 *
 *
 * @export
 * @class ModifyTerminationsModel
 */
export class ModifyTerminationsModel {
  /**
   *
   *
   * @type {IEmploymentDetailsModel}
   * @memberof ModifyTerminationsModel
   */
  employmentDetails: EmploymentDetailsModel;
  /**
   *
   *
   * @type {XtracDetailsModel}
   * @memberof ModifyTerminationsModel
   */
  xtracDetails: XtracDetailsModel;

  /**
   * Creates an instance of ModifyTerminationsModel.
   *
   * @param employmentDetails
   * @param xtracDetails
   * @memberof ModifyTerminationsModel
   */
  constructor(
    employmentDetails: EmploymentDetailsModel,
    xtracDetails: XtracDetailsModel,
  ) {
    this.employmentDetails = employmentDetails;
    this.xtracDetails = xtracDetails;
  }
}
