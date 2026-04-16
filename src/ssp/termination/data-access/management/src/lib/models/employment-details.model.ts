/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of employment details model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { ILink } from './common/error-models/Link';
import { TerminationDetails } from './termination-details.model';

type StringNullType = string | null | undefined;

/**
 *
 *
 * @export
 * @interface IEmploymentDetailsModel
 */
export class EmploymentDetailsModel {
  /**
   *
   *
   * @type {string}
   * @memberof IEmploymentDetailsModel
   */
  hireDate: StringNullType;
  /**
   *
   *
   * @type {string}
   * @memberof IEmploymentDetailsModel
   */
  adjustedHireDate: StringNullType;
  /**
   *
   *
   * @type {string}
   * @memberof IEmploymentDetailsModel
   */
  yearsOfService: StringNullType;
  /**
   *
   *
   * @type {string}
   * @memberof IEmploymentDetailsModel
   */
  rehireDate: StringNullType;
  /**
   *
   *
   * @type {string}
   * @memberof IEmploymentDetailsModel
   */
  groupBand: StringNullType;
  /**
   *
   *
   * @type {string}
   * @memberof IEmploymentDetailsModel
   */
  salaryBand: StringNullType;
  /**
   *
   *
   * @type {string}
   * @memberof IEmploymentDetailsModel
   */
  titleCode: StringNullType;

  /**
   *
   *
   * @type {boolean}
   * @memberof IEmploymentDetailsModel
   */
  esppIndicator: boolean = false;

  /**
   *
   *
   * @type {ITerminationDetails}
   * @memberof IEmploymentDetailsModel
   */
  terminationDetails: TerminationDetails | null | undefined;
  /**
   *
   *
   * @type {ILink[]}
   * @memberof IEmploymentDetailsModel
   */
  links: ILink[] | null | undefined;
}
