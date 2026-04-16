/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  inject,
  input,
} from '@angular/core';
import { FdWindowService } from '@fmr-ap123285/angular-utils';

import {
  AnalyticsTag,
  AnalyticsUtilService,
  EmploymentDetailsModel,
  EmploymentDetailsService,
  ErrorMessage,
  ManagementStore,
  ParticipantTerminationsTridionModel,
  ParticipantUI,
  TermModelConstant,
  TerminationDetails,
  UtilityService,
} from '@fmr-ap160368/sps-termination-data-access-management';

import {
  IconModule,
  LinkModule,
  LoadingIndicatorModule,
  MessageComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';
import { SpsTerminationFeatureManagementEmployeeDetailComponent } from '../employee-detail/employee-detail.component';
import { SpsTerminationFeatureManagementFetchTerminationModelsComponent } from '../fetch-termination-models/fetch-termination-models.component';
import { SpsTerminationFeatureManagementAwardsComponent } from '../awards/awards.component';
import { SpsTerminationFeatureManagementTerminationDetailComponent } from '../termination-detail/termination-detail.component';

@Component({
  selector: 'sps-termination-employee',
  imports: [
    CommonModule,
    SpsTerminationFeatureManagementEmployeeDetailComponent,
    SpsTerminationFeatureManagementFetchTerminationModelsComponent,
    SpsTerminationFeatureManagementAwardsComponent,
    SpsTerminationFeatureManagementTerminationDetailComponent,
    MessageComponent,
    IconModule,
    LinkModule,
    LoadingIndicatorModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementEmployeeComponent
  implements OnInit
{
  /**
   *
   *
   * @type {ErrorMessage}
   * @memberof EmployeeComponent
   */
  public readonly pageErr = input<ErrorMessage | undefined>();

  /**
   * @type {IEmploymentDetailsModel}
   * @memberof EmployeeComponent
   */
  public employmentDetailsModel!: EmploymentDetailsModel;

  /**
   *
   *
   * @type {ITerminationDetails}
   * @memberof EmployeeComponent
   */
  public terminationDetailsModel: TerminationDetails | null | undefined;

  /**
   *
   *
   * @type {boolean}
   * @memberof EmployeeComponent
   */
  public showSpinner!: boolean;

  /**
   *
   *
   * @type {ParticipantTerminationsTridionModel}
   * @memberof EmployeeComponent
   */
  public content!: ParticipantTerminationsTridionModel;

  /**
   * page error message
   *
   * @type {ErrorMessage}
   * @memberof EmployeeComponent
   */
  public pageError!: ErrorMessage;

  /**
   * fetch term model error message
   *
   * @type {ErrorMessage}
   * @memberof EmployeeComponent
   */
  public fetchTermModelError!: ErrorMessage;

  /**
   * condition to hide or display term model
   *
   * @type {boolean}
   * @memberof EmployeeComponent
   */
  public showTermModel: boolean = false;

  /**
   * condition for term rule IDs finished loading
   *
   * @type {boolean}
   * @memberof EmployeeComponent
   */
  public termRuleIdsLoaded: boolean = false;

  // checks if TOC V2 is available
  public isTocV2Available: boolean = false;

  public participantUIService = inject(ParticipantUI);
  public employmentDetailsService = inject(EmploymentDetailsService);
  public utilityService = inject(UtilityService);
  public analyticsService = inject(AnalyticsUtilService);
  public window = inject(FdWindowService);
  public store = inject(ManagementStore);

  private readonly loadingStatusResolved = 'resolved';
  private readonly termRuleIdsKey = 'termRuleIds';
  private hasRefetchedAfterUpdate = false;
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Creates an instance of EmployeeComponent.
   *
   * @param employmentDetailsService
   * @memberof EmployeeComponent
   */

  constructor() {
    // Combined reactive effect to handle all store state changes
    effect(() => {
      // Handle fetch term model error from store
      if (this.store.fetchTermModelError()) {
        this.fetchTermModelError = this.store.fetchTermModelError()!;
      }

      // Handle term rule IDs loading state from store
      const hasTermRuleIds = this.store.hasTermRuleIds();
      const termRuleIdsLoadingStatus = this.store.loadingStatus(
        this.termRuleIdsKey,
      );
      const isTermRuleIdsResolved =
        termRuleIdsLoadingStatus === this.loadingStatusResolved;
      const isTermRuleIdsError =
        typeof termRuleIdsLoadingStatus === 'object' &&
        'error' in termRuleIdsLoadingStatus &&
        !!termRuleIdsLoadingStatus.error;
      this.termRuleIdsLoaded =
        hasTermRuleIds || isTermRuleIdsResolved || isTermRuleIdsError;

      // Handle employment details from store reactively
      if (this.store.hasEmploymentDetails()) {
        this.processEmploymentDetails();
      }

      // derive showTermModel directly so it resets to false when a new fetch
      // starts (termModels is cleared in the store tap before each request)
      this.showTermModel = this.store.hasTermModels();

      if (this.store.isTerminationUpdating()) {
        this.hasRefetchedAfterUpdate = false;
      }

      if (
        this.store.terminationUpdateState() &&
        !this.hasRefetchedAfterUpdate
      ) {
        this.hasRefetchedAfterUpdate = true;
        this.store.fetchEmployeeDetails();
      }

      this.cdr.markForCheck();
    });
  }

  /**
   * Initialization of component takes place here
   *
   * @memberof EmployeeComponent
   */
  ngOnInit() {
    const window = this.window.getWindow();
    this.isTocV2Available = window?.isTocV2Available ?? false;

    // call service to retrieve list of termination rule IDs
    this.store.fetchTermRuleIds();
  }

  /**
   * Process employment details from store and update component state
   * @private
   * @memberof EmployeeComponent
   */
  private processEmploymentDetails(): void {
    const employmentDetails = this.store.employmentDetails();
    if (employmentDetails) {
      this.employmentDetailsModel = employmentDetails;
      this.terminationDetailsModel = employmentDetails.terminationDetails;

      const terminationReversalIndicator =
        this.terminationDetailsModel?.terminationReversalIndicator;
      if (terminationReversalIndicator === TermModelConstant.Y) {
        this.terminationDetailsModel!.terminationReversalIndicator =
          TermModelConstant.YES;
      } else if (terminationReversalIndicator === TermModelConstant.N) {
        this.terminationDetailsModel!.terminationReversalIndicator =
          TermModelConstant.NO;
      }

      const activeRuleIndicator =
        this.terminationDetailsModel?.activeRuleIndicator;
      if (activeRuleIndicator === TermModelConstant.Y) {
        this.terminationDetailsModel!.activeRuleIndicator =
          TermModelConstant.YES;
      } else if (activeRuleIndicator === TermModelConstant.N) {
        this.terminationDetailsModel!.activeRuleIndicator =
          TermModelConstant.NO;
      }
      if (
        this.terminationDetailsModel &&
        this.utilityService.isStringNotEmpty(
          this.terminationDetailsModel.terminationDate,
        ) &&
        this.utilityService.isStringNotEmpty(
          this.terminationDetailsModel.terminationId,
        )
      ) {
        // TODO: remove this eventually, since store is handling it now
        // this.fetchTermModelsService.showTermModel.next(true);
      } else {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          { pageStatus: AnalyticsTag.modelingAvailable },
        );
      }
      this.cdr.markForCheck();
    }
  }
}
