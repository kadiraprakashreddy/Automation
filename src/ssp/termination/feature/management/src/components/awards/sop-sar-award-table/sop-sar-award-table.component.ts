/**
 * @copyright 2026, FMR LLC
 * @file This file contains the implementation of SOP/SAR awards table in termination management feature.
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
} from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import {
  BoldTextPipe,
  IGrant,
  IMessages,
  IModelTable,
  IPlanDetail,
  ITableHeaders,
  TermModelConstant,
  vestingDetailsNotAvailable,
} from '@fmr-ap160368/sps-termination-data-access-management';
import {
  DESIGN_SYSTEM_NAMESPACE,
  FootnoteComponent,
  IconModule,
  LabelComponent,
  LinkModule,
  LoadingIndicatorModule,
  Size,
  StandardSize,
  TableWrapperComponent,
  TitleComponent,
  TooltipComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';

@Component({
  selector: 'sps-termination-sop-sar-award-table',
  standalone: true,
  imports: [
    CommonModule,
    FootnoteComponent,
    IconModule,
    LabelComponent,
    LinkModule,
    LoadingIndicatorModule,
    TableWrapperComponent,
    TitleComponent,
    TooltipComponent,
    BoldTextPipe,
    DatePipe,
  ],
  templateUrl: './sop-sar-award-table.component.html',
  styleUrl: './sop-sar-award-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementSopSarAwardTableComponent
  implements OnInit
{
  public readonly wiDsNamespace = DESIGN_SYSTEM_NAMESPACE;

  public size = Size;
  public standardSize = StandardSize;

  public readonly plan = input.required<IPlanDetail>();
  public readonly modelTable = input.required<IModelTable>();
  public readonly tableHeaders = input.required<ITableHeaders>();
  public readonly performanceIndicator = input.required<boolean>();
  public readonly perfAwardFootNote = input.required<string | undefined>();
  public readonly messages = input.required<IMessages>();
  /**
   * Check if isoRulesOverride is true for at least one grant
   *
   * @memberof SopSarAwardTableComponent
   */
  public isoRulesOverride: boolean = false;
  /**
   * Check if post termination status is vest immediately for at least one grant
   *
   * @memberof SopSarAwardTableComponent
   */
  public vestImmediatelyStatus: boolean = false;
  /**
   * List of ISO product ID messages to be displayed in bullet points
   *
   * @memberof SopSarAwardTableComponent
   */
  public isoProductIdMessageList: string[] = [];
  /**
   * List of product IDs where ISO override is true for current plan/award to keep track of existing product IDs
   *
   * @memberof SopSarAwardTableComponent
   */
  public isoProductIdList: string[] = [];
  /**
   * Blank Vesting Details.
   *
   * @type {string}
   * @memberof SopSarAwardTableComponent
   */
  public readonly vestingDetailsNotAvailable = vestingDetailsNotAvailable;

  readonly currencyPipe = inject(CurrencyPipe);
  readonly decimalPipe = inject(DecimalPipe);

  ngOnInit(): void {
    const grants: IGrant[] = this.plan()?.grants || [];
    if (grants) {
      for (const grant of grants) {
        this.getIsoMessages(grant);
      }
    }
  }
  /**
   * Method that returns Quantity and currency fields in the standard format.
   *
   * @param outstandingQuantity it can be quantity or value according to plan type
   * @param planType plan type
   * @param currencyCode currency code
   * @memberof SopSarAwardTableComponent
   */
  getFormattedQuantityOrValueByPlanType(
    outstandingQuantity: number,
    planType: string,
    currencyCode: string,
  ) {
    if (outstandingQuantity !== undefined && isNaN(outstandingQuantity)) {
      return vestingDetailsNotAvailable.notAvailable;
    }
    if (
      planType === TermModelConstant.CASH ||
      planType === TermModelConstant.CASH_PERF
    ) {
      return this.getFormattedCurrency(outstandingQuantity, currencyCode);
    } else {
      return this.getFormattedQuantity(outstandingQuantity);
    }
  }

  /**
   * Method that returns currency fields in the standard format.
   *
   * @param currency currency value
   * @param currencyCode currency code
   * @memberof SopSarAwardTableComponent
   */
  public getFormattedCurrency(currency: number, currencyCode: string): string {
    currency = this.checkNull(currency);
    if (currencyCode === TermModelConstant.USD) {
      return (
        this.currencyPipe.transform(
          currency,
          currencyCode,
          TermModelConstant.SYMBOL,
          '1.2-2',
        ) +
        ' ' +
        currencyCode
      );
    } else {
      return this.decimalPipe.transform(currency, '1.2-2') + ' ' + currencyCode;
    }
  }

  /**
   * Method that returns quantity fields in the three decimal format.
   *
   * @param quantity quantity value
   * @memberof SopSarAwardTableComponent
   */
  public getFormattedQuantity(quantity: number): string {
    quantity = this.checkNull(quantity);
    return this.decimalPipe.transform(quantity, '1.3-3')!;
  }

  /**
   * Method that returns currency fields in the standard format.
   *
   * @param currency currency value
   * @memberof SopSarAwardTableComponent
   */
  public checkNull(currency: number | undefined): number {
    if (currency === undefined) {
      return 0.0;
    }
    return currency;
  }

  /**
   * Method that decide the Alert Type for the Term rule Indicator
   *
   * @param ruleIndicator rule Indicator
   * @memberof SopSarAwardTableComponent
   */
  termRuleAlertType(ruleIndicatorValue: string): boolean {
    if (ruleIndicatorValue === this.messages()?.noRuleContent) {
      return true;
    }
    return false;
  }

  /**
   * Method return the Term Rule Content
   *
   * @param ruleIndicator rule Indicator
   * @memberof SopSarAwardTableComponent
   */
  public getTermRuleContent(ruleIndicatorValue: string): string {
    return this.messages()[ruleIndicatorValue as keyof IMessages];
  }

  /**
   * Sets flags for ISO messages to be displayed based on certain conditions
   * for ISO override flag and post termination status
   *
   * @param IGrant grant
   * @memberof SopSarAwardTableComponent
   */
  public getIsoMessages(grant: IGrant) {
    // check conditions for displaying ISO messages
    if (grant.isoRulesOverride) {
      // build ISO product ID message for current grant
      this.buildIsoProductIdMessageList(grant);

      this.isoRulesOverride = true;

      // check if post termination status for current grant/vesting is 'Vest Immediately' to display isoVestImmediatelyMessage
      const postStatus = grant.vestings.find((vesting) => {
        return (
          vesting.postTerminationVesting.status.toLowerCase() ===
          TermModelConstant.VESTIMMEDIATELY
        );
      });
      if (postStatus) {
        this.vestImmediatelyStatus = true;
      }
    }
  }

  /**
   * Method return the false when vesting details is NA
   *
   * @param plans plans value
   * @memberof SopSarAwardTableComponent
   */
  public getVestings(plans: IPlanDetail) {
    for (const plan of plans?.grants ?? []) {
      for (const vesting of plan?.vestings ?? []) {
        if (
          vesting?.preTerminationVesting?.outstandingQuantity !== undefined &&
          Number.isNaN(vesting?.preTerminationVesting?.outstandingQuantity)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Builds the ISO product ID message with given grant info and add it to the list of messages
   *
   * @param IGrant grant
   * @memberof SopSarAwardTableComponent
   */
  private buildIsoProductIdMessageList(grant: IGrant) {
    // check if product ID for current grant has already been used to avoid multiple messages for same product ID
    if (
      grant.productId &&
      grant.isoMonths &&
      grant.isoDays &&
      (Number(grant.isoMonths) !== 0 || Number(grant.isoDays) !== 0) &&
      !this.isoProductIdList.includes(grant.productId)
    ) {
      // base message
      let isoProductIdMessage = this.messages()?.isoProductIdMessage;

      // replace product ID and months/days placeholders with values from grant
      isoProductIdMessage = isoProductIdMessage
        .replace(this.messages()?.productIdPlaceholder, grant.productId)
        .replace(
          this.messages()?.monthsDaysPlaceholder,
          this.buildMonthsDaysText(
            Number(grant.isoMonths),
            Number(grant.isoDays),
          ),
        );

      // add message for current product ID to list of messages
      this.isoProductIdMessageList.push(isoProductIdMessage);

      // add product ID to list of existing product IDs
      this.isoProductIdList.push(grant.productId);
    }
  }

  /**
   * Generates text for months and days with given values for months and days
   *
   * @param number months
   * @param number days
   * @memberof SopSarAwardTableComponent
   */
  private buildMonthsDaysText(months: number, days: number): string {
    let text = '';
    if (months > 0) {
      text += months + ' ';
      if (months > 1) {
        text += TermModelConstant.MONTHS;
      } else {
        text += TermModelConstant.MONTH;
      }
    }
    if (days > 0) {
      if (months > 0) {
        text += TermModelConstant.AND;
      }
      text += days + ' ';
      if (days > 1) {
        text += TermModelConstant.DAYS;
      } else {
        text += TermModelConstant.DAY;
      }
    }
    return text;
  }
}
