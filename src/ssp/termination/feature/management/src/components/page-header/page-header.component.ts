/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import {
  AnalyticsTag,
  AnalyticsUtilService,
  EmploymentDetailsService,
  IPageHeader,
  ManagementStore,
  ParticipantUI,
  SubmitAnalyticsService,
  TermModelConstant,
  TermModelStoreConstants,
  TermRuleIdsService,
  vestingDetailsNotAvailable,
} from '@fmr-ap160368/sps-termination-data-access-management';
import {
  IconModule,
  LinkModule,
  LoadingIndicatorModule,
  MessageComponent,
  MessageVariant,
  TitleComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';

@Component({
  selector: 'sps-termination-page-header',
  standalone: true,
  imports: [
    MessageComponent,
    IconModule,
    LinkModule,
    LoadingIndicatorModule,
    TitleComponent,
  ],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementPageHeaderComponent implements OnInit {
  /**
   * page header related content
   *
   * @type {IPageHeader}
   * @memberof PageHeaderComponent
   */
  readonly content = input<IPageHeader | undefined>(undefined);

  public readonly alertVariant = MessageVariant;

  /**
   * learn more icon link
   *
   * @type {string}
   * @memberof PageHeaderComponent
   */
  public learnMoreLink!: string;

  /**
   * page realm
   *
   * @type {string}
   * @memberof PageHeaderComponent
   */
  public realm!: string;
  public videoLinkURL: string = '';

  // flag to display alert banner if autocomplete results are error
  public readonly displayAutocompleteWarning = signal(false);

  // checks if TOC V2 is available
  public isTocV2Available: boolean = false;

  readonly participantUI = inject(ParticipantUI);
  readonly analyticsService = inject(SubmitAnalyticsService);
  readonly analyticsUtilService = inject(AnalyticsUtilService);
  readonly employmentDetailsService = inject(EmploymentDetailsService);
  readonly termRuleIdsService = inject(TermRuleIdsService);
  readonly windowService = inject(FdWindowService);
  readonly store = inject(ManagementStore);
  readonly cdr = inject(ChangeDetectorRef);

  private applicationType: string = AnalyticsTag.terminationManagement;

  constructor() {
    // Combined reactive effect to handle all store state changes
    effect(() => {
      const termRuleIdsLoadingStatus = this.store.loadingStatus(
        TermModelStoreConstants.TERM_IDS_KEY,
      );
      const isTermRuleIdsError =
        typeof termRuleIdsLoadingStatus === 'object' &&
        'error' in termRuleIdsLoadingStatus &&
        !!termRuleIdsLoadingStatus.error;
      this.displayAutocompleteWarning.set(isTermRuleIdsError);

      // Handle employment details changes
      if (this.store.hasEmploymentDetails()) {
        this.videoLinkURL = this.store.getLink(TermModelConstant.VIDEO) ?? '';
      }
    });
  }

  ngOnInit(): void {
    const window = this.windowService.getWindow();
    this.learnMoreLink = window.apis.learnMoreLink;
    this.realm = window.config.pageContextUser;
    this.isTocV2Available = window?.isTocV2Available ?? false;

    if (
      this.content()?.pageTitle?.toLowerCase() !==
      vestingDetailsNotAvailable?.manageTermination?.toLowerCase()
    ) {
      this.participantUI.shouldDisplayTermModels = true;
      this.applicationType = AnalyticsTag.terminationModeling;
    }
  }

  /**
   * This method opens the learn more page.
   *
   * @memberof PageHeaderComponent
   */
  public openLearnMoreLink() {
    this.windowService
      .getWindow()
      .advancedlink(this.learnMoreLink, '', '653x790', '');
    this.analyticsService.submitAnalytics('learn more');
  }

  /**
   * This method tags video link click for analytics
   *
   * @memberof PageHeaderComponent
   */
  public tagVideoLink() {
    this.analyticsUtilService.tagExitLink(
      this.videoLinkURL,
      this.content()?.termModelVideoLabel ?? '',
      this.applicationType,
    );
  }
}
