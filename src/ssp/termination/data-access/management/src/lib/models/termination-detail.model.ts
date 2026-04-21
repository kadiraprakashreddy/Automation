/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of termination detail model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

/**
 *
 * @export
 * @interface ITerminationDetail
 */
export interface ITerminationDetail {
  /**
   *
   * @type {string}
   * @memberof ITerminationDetail
   */
  terminationTitle: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  terminationDescription: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  terminationInfoMsg: string;
  /**
   *
   * @type {string}
   * @memberof ITerminationDetail
   */
  dateLabel: string;
  /**
   *
   * @type {string}
   * @memberof ITerminationDetail
   */
  termDateMicrocopy: string;
  /**
   *
   * @type {string}
   * @memberof ITerminationDetail
   */
  adjustDateMicrocopy: string;
  /**
   *
   * @type {string}
   * @memberof ITerminationDetail
   */
  idLabel: string;
  /**
   *
   * @type {string}
   * @memberof ITerminationDetail
   */
  idMicrocopy: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  reversedLabel: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  adjustEditLabel: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  reverseEditLabel: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  reverseToolTipMessage: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  spinnerLoadingMsg: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  spinnerLoadingAdditionalMsg: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  adjustTermProcessingMsg: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  reverseTermProcessingMsg: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  termProcessingInfoMsg: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  termProcessingInfoHyperLink: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  termProcessingInfoPageText: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  cancelButton: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  cancelButtonTextForScreenReader: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  submitButton: string;
  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  submitButtonTextForScreenReader: string;

  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  terminationProcessedInfoMsg: string;

  /**
   * @type {string}
   * @memberof ITerminationDetail
   */
  autocompleteLabel: string;
}
