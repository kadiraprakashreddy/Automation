/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of confirmation modal
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

export interface IConfirmationModalContent {
  /**
   *
   *
   * @type {string}
   * @memberof IConfirmationModalContent
   */
  overlayTitle: string;
  /**
   *
   *
   * @type {string}
   * @memberof IConfirmationModalContent
   */
  xtracNumberLabel: string;
  /**
   *
   *
   * @type {string}
   * @memberof IConfirmationModalContent
   */
  commentsLabel: string;
  /**
   *
   *
   * @type {string}
   * @memberof IConfirmationModalContent
   */
  warningMessage: string;
  /**
   *
   *
   * @type {string}
   * @memberof IConfirmationModalContent
   */
  cancelButton: string;
  /**
   *
   *
   * @type {string}
   * @memberof IConfirmationModalContent
   */
  cancelButtonTextForScreenReader: string;
  /**
   *
   *
   * @type {string}
   * @memberof IConfirmationModalContent
   */
  submitButton: string;
  /**
   *
   *
   * @type {string}
   * @memberof IConfirmationModalContent
   */
  submitButtonTextForScreenReader: string;
}
