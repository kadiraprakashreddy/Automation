/**
 * @copyright 2026, FMR LLC
 * @file This file is to define structure of IAnalyticsModel model
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */

import { ErrorAnalytics } from './ErrorAnalytics';
import { SiteEvents } from './SiteEvents';
/* eslint-disable @typescript-eslint/naming-convention */
export interface AnalyticsModel {
  site_hierarchy?: string[];
  site_events?: SiteEvents;
  event_name?: string;
  action_detail?: string;
  application_type?: string;
  form_name?: string;
  errors?: ErrorAnalytics[];
  action_type?: string;
  form_error?: string;
  view_name?: string;
  capability?: string;
  sub_capability?: string;
}
