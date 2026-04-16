/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of participant terminations model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { IPageHeader } from './page-header.model';
import { IConfirmationModalContent } from './confirmation-modal.model';
import { IEmployeeDetail } from './employee-detail.model';
import { ITerminationDetail } from './termination-detail.model';
import { IMessages } from './messages-sdl.content';
import { ISDLResourceBundle } from './sdl-resource-bundle.model';

/**
 *
 *
 * @export
 * @interface ParticipantTerminationsTridionModel
 */
export interface ParticipantTerminationsTridionModel {
  /**
   *
   *
   * @type {ResourceBundles}
   * @memberof ParticipantTerminationsTridionModel
   */
  resourceBundles: ResourceBundles;
}

/**
 *
 *
 * @export
 * @interface ResourceBundles
 */
export interface ResourceBundles extends ISDLResourceBundle {
  /**
   *
   *
   * @type {IPageHeader}
   * @memberof ResourceBundles
   */
  pageHeaderSection: IPageHeader;
  /**
   *
   *
   * @type {IConfirmationModalContent}
   * @memberof ResourceBundles
   */
  adjustTerminationConfirmationOverlay: IConfirmationModalContent;
  /**
   *
   *
   * @type {IEmployeeDetail}
   * @memberof ResourceBundles
   */
  employeeDetailsSection: IEmployeeDetail;
  /**
   *
   *
   * @type {ITerminationDetail}
   * @memberof ResourceBundles
   */
  terminationDetailsSection: ITerminationDetail;
  /**
   *
   *
   * @type {IConfirmationModalContent}
   * @memberof ResourceBundles
   */
  reverseTerminationConfirmationOverlay: IConfirmationModalContent;

  /**
   * Information messages like inline error, warning, info messages
   *
   * @type {IMessages}
   * @memberof ResourceBundles
   */
  messages: IMessages;
}
