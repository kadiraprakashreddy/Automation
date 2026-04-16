/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of SDL resource bundle model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { IPageHeader } from './page-header.model';
import { IEmployeeDetail } from './employee-detail.model';
import { IMessages } from './messages-sdl.content';

export interface ISDLResourceBundle {
  employeeDetailsSection: IEmployeeDetail;
  messages: IMessages;
  pageHeaderSection: IPageHeader;
  eReview: ISdlEreview;
}

export interface ISDLContent {
  resourceBundles: ISDLResourceBundle;
}

export interface ISdlEreview {
  eReviewNo: string;
}
