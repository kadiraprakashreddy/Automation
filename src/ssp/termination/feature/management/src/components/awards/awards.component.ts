/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
/**
 * @copyright 2026, FMR LLC
 * @file This is the Awards component which is responsible for displaying the awards information in the Termination Management feature. It fetches the term model data from the store and displays it in a tabular format. It also provides functionality to export the term model data to Excel.
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
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
import { CommonModule, DatePipe, formatDate } from '@angular/common';

import {
  BoldTextPipe,
  EmploymentDetailsService,
  ErrorMessage,
  FetchTermModelsService,
  IAward,
  IModelResult,
  IPlanDetail,
  ITableHeaders,
  ITerminationModelResourceBundle,
  ManagementStore,
  ResourceBundles,
  SDLContentService,
  TermModelConstant,
  TerminationDetails,
  UtilityService,
} from '@fmr-ap160368/sps-termination-data-access-management';
import {
  ButtonComponent,
  ButtonVariant,
  IconModule,
  InlineMessageComponent,
  LinkModule,
  LoadingIndicatorModule,
  MessageComponent,
  MessageVariant,
  MicrocopyComponent,
  StandardSize,
  TitleComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';
import { SpsTerminationFeatureManagementOtherAwardTableComponent } from './other-award-table/other-award-table.component';
import { SpsTerminationFeatureManagementSopSarAwardTableComponent } from './sop-sar-award-table/sop-sar-award-table.component';

@Component({
  selector: 'sps-termination-awards',
  imports: [
    CommonModule,
    SpsTerminationFeatureManagementOtherAwardTableComponent,
    SpsTerminationFeatureManagementSopSarAwardTableComponent,
    MessageComponent,
    ButtonComponent,
    IconModule,
    InlineMessageComponent,
    LinkModule,
    MicrocopyComponent,
    LoadingIndicatorModule,
    TitleComponent,
    BoldTextPipe,
    DatePipe,
  ],
  templateUrl: './awards.component.html',
  styleUrl: './awards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementAwardsComponent implements OnInit {
  public standardSize = StandardSize;
  public alertVariant = MessageVariant;
  public buttonVariant = ButtonVariant;

  public readonly terminationDetails = input.required<TerminationDetails>();

  /**
   *
   * @type {boolean}
   * @memberof AwardsComponent
   */
  public readonly esppAvailable = input.required<boolean>();

  readonly sdlContentService = inject(SDLContentService);
  readonly fetchTermModelsService = inject(FetchTermModelsService);
  readonly employmentDetailsService = inject(EmploymentDetailsService);
  readonly utilityService = inject(UtilityService);
  readonly window = inject(FdWindowService);
  readonly store = inject(ManagementStore);
  readonly cdr = inject(ChangeDetectorRef);

  /**
   * @type {ITerminationModelResourceBundle}
   * @memberof AwardsComponent
   */
  public resourceBundle!: ITerminationModelResourceBundle;
  /**
   * @type {ResourceBundles}
   * @memberof AwardsComponent
   */
  public resourceBundlesTerminationDetail!: ResourceBundles;
  /**
   * @type {IModelResult}
   * @memberof AwardsComponent
   */
  public modelResult!: IModelResult;
  /**
   * @type {IAward}
   * @memberof AwardsComponent
   */
  public awards: IAward | null | undefined;

  /**
   * @type {IPlanDetail[]}
   * @memberof AwardsComponent
   */
  public plans: IPlanDetail[] = [];

  /**
   *
   * @type {boolean}
   * @memberof AwardsComponent
   */
  public divisionalRestricted: boolean | undefined;

  /**
   *
   * @type {boolean}
   * @memberof AwardsComponent
   */
  public partialDivisionalRestricted: boolean | undefined;

  /**
   *
   * @type {boolean}
   * @memberof AwardsComponent
   */
  public noGrants: boolean | undefined;

  /**
   *
   *
   * @type {ErrorMessage}
   * @memberof AwardsComponent
   */
  public errorMessage!: ErrorMessage | null;

  /**
   *
   *
   * @type {ErrorMessage}
   * @memberof AwardsComponent
   */
  public csvErrorMessage: ErrorMessage | null | undefined;

  /**
   *
   *
   * @type {boolean}
   * @memberof AwardsComponent
   */
  public showSpinner!: boolean;
  /**
   *
   *
   * @type {boolean}
   * @memberof AwardsComponent
   */
  public exportExcelSpinner!: boolean;

  /**
   * @type {string}
   * @memberof AwardsComponent
   */
  public modelResultsInfo: string = '';

  /**
   * @type {string}
   * @memberof AwardsComponent
   */
  public termDate: string = '';

  // checks if TOC V2 is available
  public isTocV2Available: boolean = false;

  constructor() {
    // React to term model state coming from ManagementStore
    effect(() => {
      this.showSpinner = this.store.isLoading();
      this.exportExcelSpinner = this.store.exportInProgress();
      if (this.store.csvExportError()) {
        this.csvErrorMessage = this.store.csvExportError();
      }
      if (this.store.hasTermModels()) {
        const termModels = this.store.termModels();
        // reset previous error messages when updating
        this.errorMessage = null;
        this.csvErrorMessage = null;
        this.awards = termModels;
        this.noGrants = termModels?.noGrants;
        this.divisionalRestricted = termModels?.divisionalRestricted;
        this.partialDivisionalRestricted =
          termModels?.partialDivisionalRestricted;
        this.plans = termModels?.plans || [];
        this.modelResultsInfo = this.buildModelResultsInfoText();
      } else {
        this.plans = [];
      }
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.loadSDLContent();
    this.requestTermModelIfNeeded();
  }

  /**
   * Method that returns whether performance grant or not.
   *
   * @param plan plan details
   * @memberof AwardTableComponent
   */
  public getPerformanceIndicator(plan: IPlanDetail): boolean {
    if (
      plan.planType === TermModelConstant.CASH_PERF ||
      plan.planType === TermModelConstant.RSU_PERF
    ) {
      return true;
    }
    return false;
  }

  /**
   * Method that returns table head.
   *
   * @param plan plan details
   * @memberof AwardTableComponent
   */
  public getTableHeaders(plan: IPlanDetail): ITableHeaders {
    const awardType: string = plan.planType;

    return this.resourceBundle[
      (awardType.toLowerCase() +
        TermModelConstant.TABLE_HEADER) as keyof ITerminationModelResourceBundle
    ] as ITableHeaders;
  }

  /**
   * Method to download term model excel.
   *
   * @memberof AwardTableComponent
   */
  public downloadTermModelExcel() {
    this.csvErrorMessage = null;
    const termModelUrl = this.store.getLink(TermModelConstant.AWARD);
    this.store.exportTermModels([
      termModelUrl ?? '',
      this.fetchTermModelsService.termDate() ?? '',
      this.fetchTermModelsService.termId() ?? '',
      this.esppAvailable(),
    ]);
  }

  private loadSDLContent(): void {
    // check store for content
    if (this.store.hasSDLContent()) {
      const resourceBundles = this.store.sdlContent()
        ?.resourceBundles as ITerminationModelResourceBundle;
      this.resourceBundle = resourceBundles;
      this.modelResult = resourceBundles?.modelResults;
    }

    const window = this.window.getWindow();
    this.isTocV2Available = window?.isTocV2Available ?? false;

    if (this.store.hasSDLContent()) {
      const sdl = this.store.sdlContent();

      if (sdl?.resourceBundles) {
        this.resourceBundle =
          sdl?.resourceBundles as ITerminationModelResourceBundle;
        this.modelResult = this.resourceBundle.modelResults;

        this.resourceBundlesTerminationDetail =
          sdl?.resourceBundles as ResourceBundles;
        this.cdr.markForCheck();
      }
    }
  }

  private requestTermModelIfNeeded(): void {
    // Request term model via store instead of direct service call
    if (
      !this.awards &&
      this.utilityService.isStringNotEmpty(
        this.terminationDetails()?.terminationDate,
      ) &&
      this.utilityService.isStringNotEmpty(
        this.terminationDetails()?.terminationId,
      )
    ) {
      const url = this.store.getLink(TermModelConstant.AWARD);
      this.store.fetchTermModel([
        url ?? '',
        this.terminationDetails()?.terminationDate ?? '',
        this.terminationDetails()?.terminationId ?? '',
      ]);
    }
  }

  /**
   * Method that builds model results info text.
   *
   * @memberof AwardTableComponent
   */
  private buildModelResultsInfoText(): string {
    // guard against missing SDL/resource bundle during tests
    if (!this.resourceBundle || !this.resourceBundle.messages) {
      return '';
    }
    const baseStatement =
      this.resourceBundle.messages.modelResultsPlanTypesInfo;
    const datePlaceholder = this.resourceBundle.messages.datePlaceholder;
    let message: string = '';
    if (this.fetchTermModelsService.termDate()) {
      const termDateString = this.fetchTermModelsService.termDate()!;
      this.termDate = formatDate(
        termDateString,
        this.resourceBundle.messages.modelResultsDateFormat || 'MMM-dd-yyyy',
        'en-US',
      );
      message = baseStatement.replace(datePlaceholder, this.termDate);
      if (this.esppAvailable()) {
        message += ' ' + this.resourceBundle.messages.esppAvailableMessage;
      }
    }

    return message;
  }
}
