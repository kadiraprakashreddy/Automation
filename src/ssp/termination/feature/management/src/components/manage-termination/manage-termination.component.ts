/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file This file contains manage termination component
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import {
  AnalyticsTag,
  AnalyticsUtilService,
  EmploymentDetailsService,
  ErrorHandlingUtils,
  ErrorMessage,
  IPageHeader,
  ISDLContent,
  ManagementStore,
  ParticipantUI,
  SDLContentService,
  UpdateTerminationDetailsService,
  isNullOrUndefinedOrEmpty,
} from '@fmr-ap160368/sps-termination-data-access-management';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LoadingStatusEnum } from '@fmr-ap167419/shared-core-data-access-loading-status';
import { CommonModule } from '@angular/common';
import {
  FootnoteComponent,
  FootnotesComponent,
  IconModule,
  LinkModule,
  LoadingIndicatorModule,
  MessageComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';
import { SpsTerminationFeatureManagementEmployeeComponent } from '../employee/employee.component';
import { SpsTerminationFeatureManagementPageHeaderComponent } from '../page-header/page-header.component';
import { EmployerPlatformParticipantHeaderModule } from '@fmr-ap160368/employer-platform-feature-participant-header';
import { EmployerPlatformParticipantTocComponent } from '@fmr-ap160368/employer-platform-feature-participant-toc';

@Component({
  selector: 'sps-termination-manage-termination',
  imports: [
    CommonModule,
    SpsTerminationFeatureManagementEmployeeComponent,
    EmployerPlatformParticipantHeaderModule,
    SpsTerminationFeatureManagementPageHeaderComponent,
    MessageComponent,
    EmployerPlatformParticipantTocComponent,
    FootnoteComponent,
    FootnotesComponent,
    IconModule,
    LinkModule,
    LoadingIndicatorModule,
  ],
  templateUrl: './manage-termination.component.html',
  styleUrl: './manage-termination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementManageTerminationComponent
  implements OnInit
{
  /**
   *
   * @type {string}
   * @memberof ManageTerminationComponent
   */
  public participantHeaderURI: string;

  /**
   * @type {boolean}
   * @memberof ManageTerminationComponent
   */
  public isParticipantCardAvailable: boolean;

  /**
   *
   * @type {boolean}
   * @memberof ManageTerminationComponent
   */
  public isTocV2Available: boolean = false;

  /**
   *
   * @type {string}
   * @memberof ManageTerminationComponent
   */
  public expandedSections: string;

  /**
   *
   * @type {string}
   * @memberof ManageTerminationComponent
   */
  public participantContext: string;

  /**
   *
   * @type {IPageHeader}
   * @memberof ManageTerminationComponent
   */
  public headerContent!: IPageHeader;
  /**
   *
   * @type {boolean}
   * @memberof ManageTerminationComponent
   */
  public showSpinner!: boolean;

  /**
   * page error message
   *
   * @type {ErrorMessage}
   * @memberof ManageTerminationComponent
   */
  public pageError!: ErrorMessage;

  /**
   * @type {ErrorMessage}
   * @memberof FileUploadComponent
   */
  public tridionDataErrorMessage: ErrorMessage | null | undefined;

  /**
   * @type {ISDLContent}
   * @memberof ManageTerminationComponent
   */
  public content: ISDLContent | null | undefined;

  /**
   * old participant error message
   *
   * @type {ErrorMessage}
   * @memberof ManageTerminationComponent
   */
  public participantError: ErrorMessage | null | undefined;

  /**
   * update Success
   *
   * @type {boolean}
   * @memberof ManageTerminationComponent
   */
  public updateSuccess!: boolean;

  public sdlService = inject(SDLContentService);
  public employmentDetailsService = inject(EmploymentDetailsService);
  public analyticsService = inject(AnalyticsUtilService);
  public participantUI = inject(ParticipantUI);
  public updateTerminationDetails = inject(UpdateTerminationDetailsService);
  public windowService = inject(FdWindowService);

  readonly store = inject(ManagementStore);
  private readonly cdr = inject(ChangeDetectorRef);
  private hasLoadedSDLContent = false;
  private readonly hadEmploymentDetailsErrorReported = signal(false);

  constructor() {
    // Combined reactive effect to handle all store state changes
    effect(() => {
      // Handle SDL content changes
      if (this.store.hasSDLContent()) {
        this.handleSDLContentChanges();
      }

      // Handle employment details changes
      if (this.store.hasEmploymentDetails()) {
        const employmentDetails = this.store.employmentDetails();
        if (!this.participantUI.contentURI) {
          this.participantUI.setUIBehavior(employmentDetails!, true);
          if (this.canLoadSDLContent()) {
            this.store.loadSDLContent();
          }
        }
        this.handleEmploymentDetailsChanges();
      }

      const employmentDetailsError = this.store.employmentDetailsError();
      const hasEmploymentDetailsError = !!employmentDetailsError;

      if (hasEmploymentDetailsError) {
        this.pageError = employmentDetailsError!;

        if (this.canLoadSDLContent()) {
          this.store.loadSDLContent();
        }

        if (!this.hadEmploymentDetailsErrorReported()) {
          this.trackEmploymentDetailsErrorAnalytics();
        }
        this.hadEmploymentDetailsErrorReported.set(hasEmploymentDetailsError);
      }

      // Handle store errors
      const loadingStatus = this.store.loadingStatus('content');
      if (
        typeof loadingStatus === 'object' &&
        'error' in loadingStatus &&
        loadingStatus.error
      ) {
        const errorMsg: ErrorMessage | null = this.store.errorMessage();
        this.tridionDataErrorMessage = {
          title: errorMsg?.title,
          detail: errorMsg?.detail,
        } as ErrorMessage;
        this.handleAnalyticsError();
      } else if (
        loadingStatus === LoadingStatusEnum.Resolved &&
        this.tridionDataErrorMessage
      ) {
        this.tridionDataErrorMessage = null;
      }
    });
  }

  /**
   * Initialization of component takes place here
   *
   * @memberof ManageTerminationComponent
   */
  ngOnInit(): void {
    // Initialize properties from window config
    const window = this.windowService.getWindow();
    this.participantHeaderURI = window?.config?.participantHeaderURI;
    this.expandedSections = window?.config?.expandedSections;
    this.participantContext = window?.config?.participantFeatureContext;
    this.isParticipantCardAvailable = window?.isPartCardAvailable;
    this.isTocV2Available = window?.isTocV2Available ?? false;

    if (
      isNullOrUndefinedOrEmpty(this.participantHeaderURI) ||
      isNullOrUndefinedOrEmpty(this.participantContext)
    ) {
      this.sendErrorEvent();
    }
    this.store.fetchEmployeeDetails();
  }

  /**
   * It will update the component about Participant Header Status.
   *
   * @param event that contains status information.
   * @memberof ManageTerminationComponent
   */
  public updateParticipantHeaderStatus(event: { isError?: boolean }) {
    if (event.isError) {
      this.participantError = ErrorHandlingUtils.getErrorMessage();
    }
  }

  /**
   * It will update the component about TOC Status.
   *
   * @param event that contains status information.
   * @memberof ManageTerminationComponent
   */
  public updateTocStatus(event: { isError?: boolean }) {
    if (event.isError) {
      this.participantError = ErrorHandlingUtils.getErrorMessage();
    }
  }

  /**
   * Check if SDL content load is safe to execute.
   * Returns true only when SDL content is not already loaded, not currently loading, and has no error.
   *
   * @returns {boolean} True if safe to load SDL content
   * @private
   */
  private canLoadSDLContent(): boolean {
    const loadingStatus = this.store.loadingStatus('content');
    // SDL content not already loaded
    const contentNotLoaded = !this.store.hasSDLContent();
    // Not loading in progress
    const isNotLoading = loadingStatus !== 'loading';
    // Not in error state
    const hasNoError = !(
      typeof loadingStatus === 'object' &&
      'error' in loadingStatus &&
      !!loadingStatus.error
    );
    return contentNotLoaded && isNotLoading && hasNoError;
  }

  /**
   * Handle analytics for SDL service errors
   * @private
   */
  private handleAnalyticsError(): void {
    if (this.participantUI.shouldDisplayTermModels === true) {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.sdlServiceError },
      );
    } else if (this.participantUI.shouldDisplayTermModels === false) {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationManagement + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.sdlServiceError },
      );
    }
    this.cdr.markForCheck();
  }

  /**
   * Submit employment details error analytics for an error-state transition.
   * @private
   */
  private trackEmploymentDetailsErrorAnalytics(): void {
    if (this.participantUI.shouldDisplayTermModels === true) {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.employeeDetailsServiceError },
      );
    } else if (this.participantUI.shouldDisplayTermModels === false) {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationManagement + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.employeeDetailsServiceError },
      );
    }
  }

  /**
   * Handle SDL content changes from store
   * @private
   * @memberof ManageTerminationComponent
   */
  private handleSDLContentChanges(): void {
    this.content = this.store.sdlContent();
    if (this.content) {
      this.headerContent = this.content.resourceBundles.pageHeaderSection;
    }
    this.cdr.markForCheck();
  }

  /**
   * Handle employment details changes from store
   * @private
   * @memberof ManageTerminationComponent
   */
  private handleEmploymentDetailsChanges(): void {
    const employmentDetails = this.store.employmentDetails();
    if (employmentDetails) {
      this.updateTerminationDetails.updateSuccess.subscribe(
        (updateResponse) => {
          this.updateSuccess = updateResponse;
        },
      );
      this.cdr.markForCheck();
    }
  }

  /**
   * Method to set page error
   *
   * @private
   * @param [error]
   * @memberof ManageTerminationComponent
   */
  private sendErrorEvent(error?: HttpErrorResponse) {
    if (
      this.sdlService.resourceBundles === null ||
      this.sdlService.resourceBundles === undefined
    ) {
      this.participantError = ErrorHandlingUtils.getErrorMessage();
    } else {
      this.participantError = ErrorHandlingUtils.getErrorMessage(
        error,
        this.sdlService.resourceBundles.messages.serviceErrorTitle,
        this.sdlService.resourceBundles.messages.serviceErrorBody,
      );
    }
  }
}
