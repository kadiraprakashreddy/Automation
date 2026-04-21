/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file This Service is responsible for making Analytics calls.
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import { ErrorAnalytics } from './../models/commonAnalytics/ErrorAnalytics';
import { SiteEvents } from './../models/commonAnalytics/SiteEvents';
import { AnalyticsModel } from './../models/commonAnalytics/AnalyticsModel';
import { UtilityService } from '../services/utility.service';
import { Injectable, inject } from '@angular/core';
import {
  FdAnalyticsService,
  FdWindowService,
} from '@fmr-ap123285/angular-utils';

/**
 * @copyright 2020, FMR LLC
 * @file This Service is responsible for making Analytics calls.
 */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum AnalyticsTag {
  participant = 'participant',
  sps = 'sps',
  pageView = 'page view',
  exitLink = 'exit link',
  modeling = 'modeling',
  management = 'management',
  spsParticipantTermination = 'sps participant termination',
  terminationManagement = 'Termination management',
  terminationModeling = 'Termination modeling',
  formError = 'form error',
  userAction = 'user action:',
  status = '{status}',
  psw = 'psw',
  spark = 'spark',
  modelingAvailable = 'modeling available',
  noResultFound = 'no result found',
  resultsPrePopulated = 'results pre-populated',
  termModelSystemError = 'term model system error',
  calculate = 'calculate',
  results = 'results',
  userActionForSiteEvent = 'user_action',
  formErrorForSiteEvent = 'form_error',
  reset = 'reset',
  employeeDetails = 'employee details',
  sdlServiceError = 'sdl service error',
  employeeDetailsServiceError = 'employee detail service error',
  reverseSubmit = 'reverse submit',
  adjustSubmit = 'adjust submit',
  adjustSave = 'adjust save',
  adjustCancl = 'adjust cancel',
  reverseModel = 'reverse modal',
  adjust = 'adjust',
  adjustModelCancel = 'adjust modal cancel',
  reverseModelCancel = 'reverse modal cancel',
  expand = 'expand',
  collapse = 'collapse',
  export = 'export',
  toExcel = ' to excel',
  error = 'error',
  systemError = 'System Error',
  fullPlanRestriction = 'full plan restriction',
  partialPlanRestriction = 'partial plan restriction',
  capability = 'participant',
  sub_capability = 'participant|data',
}

interface PageContextMap {
  plansponsor: string;
  spark: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsUtilService {
  pageContextMap: PageContextMap = {
    plansponsor: AnalyticsTag.psw,
    spark: AnalyticsTag.spark,
  };

  private readonly utilService = inject(UtilityService);
  private readonly fdAnalyticsService = inject(FdAnalyticsService);
  private readonly windowService = inject(FdWindowService);

  /**
   * Responsible for make analytics calls for page view
   *
   * @param pageType sdl content to represent current page type
   * @param pageStatus pagestatus
   */
  public pageViewSubmitAnalytics(
    pageType: string,
    opts: {
      pageStatus?: string;
      viewName?: string;
    },
  ): void {
    const analyticsModel: AnalyticsModel = {};
    const siteEvents: SiteEvents = {};

    if (this.utilService.isStringNotEmpty(pageType)) {
      const pageName = this.constructAnalyticsMessage(
        pageType,
        opts.pageStatus!,
      );

      analyticsModel.site_hierarchy = [
        this.pageContextMap[
          this.windowService.getWindow().config
            .pageContextUser as keyof PageContextMap
        ],
        AnalyticsTag.participant,
        AnalyticsTag.sps,
        pageName,
      ];

      if (this.utilService.isStringNotEmpty(opts.viewName)) {
        analyticsModel.view_name = opts.viewName;
      }

      siteEvents['spa_page_view'] = true;
      analyticsModel.action_type = AnalyticsTag.pageView;

      if (pageType.includes(AnalyticsTag.modeling)) {
        analyticsModel.application_type =
          AnalyticsTag.spsParticipantTermination;
      } else if (pageType.includes(AnalyticsTag.management)) {
        analyticsModel.application_type =
          AnalyticsTag.terminationManagement.toLowerCase();
      }

      analyticsModel.capability = AnalyticsTag.capability;
      analyticsModel.sub_capability = AnalyticsTag.sub_capability;

      analyticsModel.site_events = siteEvents;
      this.fdAnalyticsService.submitAnalytics(analyticsModel);
    }
  }

  /**
   * Responsible for make analytics calls for page actions
   *
   * @param siteEventKey key of site event object eg: file_download
   * @param applicationType for Application Type
   * @param actionDetail Sdl content
   * @param errorMessage Error message
   * @param formName Form Name
   * @param pageType Page Type
   */
  public pageActionSubmitAnalytics(
    siteEventKey: string,
    applicationType: string,
    opts: {
      actionDetail?: string;
      errorAnalyticsArray?: ErrorAnalytics[];
      formName?: string;
      pageType?: string;
    },
  ): void {
    const analyticsModel: AnalyticsModel = {};
    const siteEvents: SiteEvents = {};

    if (
      Array.isArray(opts.errorAnalyticsArray) &&
      this.utilService.isStringNotEmpty(opts.formName)
    ) {
      analyticsModel.form_name = opts.formName;
      analyticsModel.errors = opts.errorAnalyticsArray;
      analyticsModel.event_name = AnalyticsTag.formError;
      siteEvents['form_error'] = true;
    } else {
      siteEvents[siteEventKey] = true;
      if (Array.isArray(opts.errorAnalyticsArray)) {
        analyticsModel.errors = opts.errorAnalyticsArray;
      }
    }
    if (this.utilService.isStringNotEmpty(opts.actionDetail)) {
      siteEvents[siteEventKey] = true;
      analyticsModel.action_detail = opts.pageType + ':' + opts.actionDetail;
      analyticsModel.event_name =
        AnalyticsTag.userAction + opts.pageType + ':' + opts.actionDetail;
    }
    analyticsModel.site_events = siteEvents;

    if (applicationType.includes(AnalyticsTag.modeling)) {
      analyticsModel.application_type = AnalyticsTag.spsParticipantTermination;
    } else if (applicationType.includes(AnalyticsTag.management)) {
      analyticsModel.application_type =
        AnalyticsTag.terminationManagement.toLowerCase();
    }

    analyticsModel.capability = AnalyticsTag.capability;
    analyticsModel.sub_capability = AnalyticsTag.sub_capability;

    this.fdAnalyticsService.submitAnalytics(analyticsModel);
  }

  /**
   * This function is used to tag exit links
   *
   * @param exitLink
   * @param exitLinkTitle
   * @param applicationType
   */
  public tagExitLink(
    exitLink: string,
    exitLinkTitle: string,
    applicationType: string,
  ) {
    // set application type based on parameter
    let appType: string = AnalyticsTag.spsParticipantTermination;
    if (applicationType.includes(AnalyticsTag.management)) {
      appType = AnalyticsTag.terminationManagement.toLowerCase();
    }

    this.fdAnalyticsService.submitAnalytics({
      site_events: {
        exit_link: true,
      },
      exit_link_url: exitLink,
      exit_link_title: exitLinkTitle,
      event_name: AnalyticsTag.exitLink,
      application_type: appType,
      capability: AnalyticsTag.capability,
      sub_capability: AnalyticsTag.sub_capability,
    });
  }

  private constructAnalyticsMessage(
    feature: string,
    pageStatus: string,
  ): string {
    if (feature.includes(AnalyticsTag.status)) {
      return feature.replace(AnalyticsTag.status, pageStatus);
    } else {
      return feature;
    }
  }
}
