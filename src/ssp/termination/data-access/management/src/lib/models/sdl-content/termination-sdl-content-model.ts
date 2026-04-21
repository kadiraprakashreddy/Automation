/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of ITerminationModelSDLContent model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { IEmployeeDetail } from '../employee-detail.model';
import { IMessages } from '../messages-sdl.content';
import { IPageHeader } from '../page-header.model';
import { ISDLContent, ISDLResourceBundle } from '../sdl-resource-bundle.model';
import { ITerminationDetail } from '../termination-detail.model';
import {
  IModelResult,
  IModelTable,
  IPerfFootnotes,
  ITableHeaders,
} from './award-table.model';
import { IEreview } from './ereview.model';
import { IExportReport } from './export.model';
import { ITerminationModellingSearchSection } from './search-section.model';

export interface ITerminationModelSDLContent extends ISDLContent {
  resourceBundles: ITerminationModelResourceBundle;
}

export interface ITerminationModelResourceBundle extends ISDLResourceBundle {
  employeeDetailsSection: IEmployeeDetail;
  messages: IMessages;
  cshTableHeaders: ITableHeaders;
  cshperfTableHeaders: ITableHeaders;
  rsuperfTableHeaders: ITableHeaders;
  rsuTableHeaders: ITableHeaders;
  rsaTableHeaders: ITableHeaders;
  sopTableHeaders: ITableHeaders;
  sarTableHeaders: ITableHeaders;
  eReview: IEreview;
  modelResults: IModelResult;
  pageHeaderSection: IPageHeader;
  terminationModellingSearchSection: ITerminationModellingSearchSection;
  terminationDetailsSection: ITerminationDetail;
  modelResultsTable: IModelTable;
  perfFootnotes: IPerfFootnotes;
  exportReport: IExportReport;
}
