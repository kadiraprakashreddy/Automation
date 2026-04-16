/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of employee detail model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

/**
 *
 * @export
 * @interface IEmployeeDetail
 */
export interface IEmployeeDetail {
  /**
   *
   * @type {string}
   * @memberof IEmployeeDetail
   */
  groupBandLabel: string;
  /**
   *
   * @type {string}
   * @memberof IEmployeeDetail
   */
  dateOfHireLabel: string;
  /**
   *
   * @type {string}
   * @memberof IEmployeeDetail
   */
  employeeDetailsTitle: string;
  /**
   *
   * @type {string}
   * @memberof IEmployeeDetail
   */
  activeLabel: string;
  /**
   *
   * @type {string}
   * @memberof IEmployeeDetail
   */
  adjustedDateOfHireLabel: string;
  /**
   *
   * @type {string}
   * @memberof IEmployeeDetail
   */
  yearsOfServiceLabel: string;
  /**
   * @type {string}
   * @memberof IEmployeeDetail
   */
  titleCodeLabel: string;
  /**
   * @type {string}
   * @memberof IEmployeeDetail
   */
  rehireDateLabel: string;
  /**
   * @type {string}
   * @memberof IEmployeeDetail
   */
  salaryBandLabel: string;
}
