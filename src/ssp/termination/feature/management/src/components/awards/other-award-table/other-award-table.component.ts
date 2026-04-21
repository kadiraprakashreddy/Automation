/**
 * @copyright 2026, FMR LLC
 * @file This file contains the implementation of other awards table in termination management feature.
 * @author Sreekanth (a711082), Andrew Trinh (a656803), Jagadeeswari Yalla (a783258)
 */
import {
  ChangeDetectionStrategy,
  Component,
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
  selector: 'sps-termination-other-award-table',
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
    DatePipe,
  ],
  templateUrl: './other-award-table.component.html',
  styleUrl: './other-award-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementOtherAwardTableComponent {
  readonly wiDsNamespace = DESIGN_SYSTEM_NAMESPACE;

  /**
   *
   *
   * @type {IPlanDetail}
   * @memberof OtherAwardTableComponent
   */
  public readonly plan = input.required<IPlanDetail>();
  /**
   *
   *
   * @type {IModelTable}
   */
  public readonly modelTable = input.required<IModelTable>();
  /**
   *
   *
   * @type {ITableHeaders}
   * @memberof OtherAwardTableComponent
   */
  public readonly tableHeaders = input.required<ITableHeaders>();
  /**
   *
   *
   * @type {boolean}
   * @memberof OtherAwardTableComponent
   */
  public readonly performanceIndicator = input.required<boolean>();
  /**
   * content for  performance awards foot note.
   *
   * @type {string}
   * @memberof OtherAwardTableComponent
   */
  public readonly perfAwardFootNote = input.required<string | undefined>();
  /**
   * sdl content for message
   *
   * @type {IMessages}
   * @memberof OtherAwardTableComponent
   */
  public readonly messages = input.required<IMessages>();

  public size = Size;
  public standardSize = StandardSize;
  /**
   * Blank Vesting Details.
   *
   * @type {string}
   * @memberof OtherAwardTableComponent
   */
  public readonly vestingDetailsNotAvailable = vestingDetailsNotAvailable;

  readonly currencyPipe = inject(CurrencyPipe);
  readonly decimalPipe = inject(DecimalPipe);

  /**
   * Method that returns Quantity and currency fields in the standard format.
   *
   * @param outstandingQuantity it can be quantity or value according to plan type
   * @param planType plan type
   * @param currencyCode currency code
   * @memberof OtherAwardTableComponent
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
   * @memberof OtherAwardTableComponent
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
   * @memberof OtherAwardTableComponent
   */
  public getFormattedQuantity(quantity: number): string {
    quantity = this.checkNull(quantity);
    return this.decimalPipe.transform(quantity, '1.3-3')!;
  }

  /**
   * Method that returns currency fields in the standard format.
   *
   * @param currency currency value
   * @memberof OtherAwardTableComponent
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
   * @memberof OtherAwardTableComponent
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
   * @memberof OtherAwardTableComponent
   */
  public getTermRuleContent(ruleIndicatorValue: string): string {
    return this.messages()[ruleIndicatorValue as keyof IMessages];
  }

  /**
   * Method return the false when vesting details is NA
   *
   * @param plans plans value
   * @memberof OtherAwardTableComponent
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
}
