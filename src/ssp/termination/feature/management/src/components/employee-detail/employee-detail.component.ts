/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import {
  AnalyticsTag,
  AnalyticsUtilService,
  BannerMessages,
  EmploymentDetailsModel,
  IEmployeeDetail,
  ManagementStore,
  TermModelConstant,
} from '@fmr-ap160368/sps-termination-data-access-management';

import {
  DESIGN_SYSTEM_NAMESPACE,
  ExpandCollapseComponent,
  FieldGroupComponent,
  GridWrapperComponent,
  IconModule,
  LabelComponent,
  LinkModule,
  LoadingIndicatorModule,
  MessageComponent,
  MessageVariant,
} from '@fmr-ap167419/shared-design-system-ui-core';

@Component({
  selector: 'sps-termination-employee-detail',
  standalone: true,
  imports: [
    CommonModule,
    MessageComponent,
    ExpandCollapseComponent,
    FieldGroupComponent,
    GridWrapperComponent,
    IconModule,
    LabelComponent,
    LinkModule,
    LoadingIndicatorModule,
    DatePipe,
  ],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementEmployeeDetailComponent
  implements OnInit
{
  /**
   *
   *
   * @type {EmploymentDetailsModel}
   * @memberof EmployeeDetailComponent
   */
  public readonly employeeDetails = signal<EmploymentDetailsModel | undefined>(
    undefined,
  );

  /**
   * Indicates whether participant is active or not.
   *
   * @type {string}
   * @memberof EmployeeDetailComponent
   */
  public isActiveEmployee: string | null | undefined;

  /**
   *
   *
   * @type {IEmployeeDetail}
   * @memberof EmployeeDetailComponent
   */
  public employeeDetailContent!: IEmployeeDetail;

  /**
   *
   * * @type {boolean}
   *
   * @memberof EmployeeDetailComponent
   */

  public isBannerMessage: boolean = false;

  /**
   * Initialization of Banner messages
   * *
   *
   * @memberof EmployeeDetailComponent
   */

  public getBannerMessages: BannerMessages = {
    bannerMessageHeader: '',
    bannerMessageBody: '',
    bannerMessageDismissButton: '',
  };

  /**
   *
   * * @type {boolean}
   *
   * @memberof EmployeeDetailComponent
   */

  isBannerVisible: boolean = true;

  // checks if TOC V2 is available
  public isTocV2Available: boolean = false;
  readonly wiDsNamespace = DESIGN_SYSTEM_NAMESPACE;

  public readonly store = inject(ManagementStore);
  public readonly analyticsService = inject(AnalyticsUtilService);
  public readonly alertVariant = MessageVariant;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly window = inject(FdWindowService);

  constructor() {
    // Combined reactive effect to handle all store state changes
    effect(() => {
      this.loadEmploymentDetails();

      // Handle SDL content changes from store
      if (this.store.hasSDLContent()) {
        this.handleSDLContentChanges();
      }
    });
  }

  /**
   * Load employment details from the store into the component.
   * Extracted so tests can invoke it directly.
   */
  public loadEmploymentDetails(): void {
    if (
      (this.store as any).hasEmploymentDetails &&
      (this.store as any).hasEmploymentDetails()
    ) {
      const storeAny = this.store as any;
      const employmentDetails =
        typeof storeAny.employmentDetails === 'function'
          ? storeAny.employmentDetails()
          : storeAny.employmentDetails;
      if (employmentDetails) {
        this.employeeDetails.set(employmentDetails);
        this.isActiveEmployee =
          this.employeeDetails()?.terminationDetails?.activeRuleIndicator;
        this.cdr.markForCheck();
      }
    }
  }

  /**
   * Initialization of component takes place here
   *
   * @memberof EmployeeDetailComponent
   */
  ngOnInit(): void {
    const window = this.window.getWindow();
    this.isTocV2Available = window?.isTocV2Available ?? false;

    // Banner messages and employee detail content now handled reactively via store in constructor
  }

  /**
   * this fucntion is called when close button is clicked in the banner
   *
   * @memberof EmployeeDetailComponent
   */
  dismissBanner(): void {
    this.isBannerVisible = false;
  }

  onExpand() {
    if (!this.employeeDetails()?.terminationDetails) {
      return;
    }

    if (
      this.employeeDetails()?.terminationDetails?.activeRuleIndicator ===
      TermModelConstant.YES
    ) {
      this.analyticsService.pageActionSubmitAnalytics(
        AnalyticsTag.userActionForSiteEvent,
        AnalyticsTag.terminationModeling,
        {
          actionDetail: AnalyticsTag.expand,
          pageType: AnalyticsTag.employeeDetails,
        },
      );
    } else if (
      this.employeeDetails()?.terminationDetails?.activeRuleIndicator ===
      TermModelConstant.NO
    ) {
      this.analyticsService.pageActionSubmitAnalytics(
        AnalyticsTag.userActionForSiteEvent,
        AnalyticsTag.terminationManagement,
        {
          actionDetail: AnalyticsTag.expand,
          pageType: AnalyticsTag.terminationManagement,
        },
      );
    }
  }

  onCollapse() {
    if (!this.employeeDetails()?.terminationDetails) {
      return;
    }

    if (
      this.employeeDetails()?.terminationDetails?.activeRuleIndicator ===
      TermModelConstant.YES
    ) {
      this.analyticsService.pageActionSubmitAnalytics(
        AnalyticsTag.userActionForSiteEvent,
        AnalyticsTag.terminationModeling,
        {
          actionDetail: AnalyticsTag.collapse,
          pageType: AnalyticsTag.employeeDetails,
        },
      );
    } else if (
      this.employeeDetails()?.terminationDetails?.activeRuleIndicator ===
      TermModelConstant.NO
    ) {
      this.analyticsService.pageActionSubmitAnalytics(
        AnalyticsTag.userActionForSiteEvent,
        AnalyticsTag.terminationManagement,
        {
          actionDetail: AnalyticsTag.collapse,
          pageType: AnalyticsTag.terminationManagement,
        },
      );
    }
  }

  /**
   * Handle SDL content changes and update banner messages
   * @private
   * @memberof EmployeeDetailComponent
   */
  private handleSDLContentChanges(): void {
    const sdlContent = this.store.sdlContent();
    if (sdlContent) {
      // Update employee detail content
      this.employeeDetailContent =
        sdlContent.resourceBundles.employeeDetailsSection;

      // Handle banner messages
      const bannerMessages = sdlContent.resourceBundles.messages;
      if (
        bannerMessages.bannerMessageHeader &&
        bannerMessages.bannerMessageBody &&
        bannerMessages.bannerMessageEnabled === 'Y'
      ) {
        this.getBannerMessages.bannerMessageHeader =
          bannerMessages.bannerMessageHeader;
        this.getBannerMessages.bannerMessageBody =
          bannerMessages.bannerMessageBody;
        this.getBannerMessages.bannerMessageDismissButton =
          bannerMessages.bannerMessageDismissButton;
        this.isBannerMessage = true;
      }

      this.cdr.markForCheck();
    }
  }
}
