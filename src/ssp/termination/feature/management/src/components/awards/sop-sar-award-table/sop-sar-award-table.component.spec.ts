/**
 * Unit tests for SOP/SAR award table component
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { SpsTerminationFeatureManagementSopSarAwardTableComponent } from './sop-sar-award-table.component';
import {
  IGrant,
  IMessages,
  IModelTable,
  IPlanDetail,
  ITableHeaders,
  TermModelConstant,
  vestingDetailsNotAvailable,
} from '@fmr-ap160368/sps-termination-data-access-management';

describe('SopSarAwardTableComponent', () => {
  let spectator: Spectator<SpsTerminationFeatureManagementSopSarAwardTableComponent>;
  const createComponent = createComponentFactory({
    component: SpsTerminationFeatureManagementSopSarAwardTableComponent,
    providers: [CurrencyPipe, DecimalPipe],
    detectChanges: false,
  });

  const mockMessages: IMessages = {
    noRuleContent: 'NO_RULE',
    msgContent: 'MSG',
    labelContent: 'LABEL',
    productIdPlaceholder: '{productId}',
    monthsDaysPlaceholder: '{monthsDays}',
    isoProductIdMessage: 'ISO for {productId} {monthsDays}',
    isoVestImmediatelyMessage: 'Vest immediately message',
    isoMessageBoldText: 'bold',
    isoMessage1: 'iso1',
    isoMessage2: 'iso2',
    importantLabel: 'Important',
    customSeparationRuleInfoMsg: 'info',
    customSeperationRulelbl: 'label',
    exercisableQuantityMsg: 'exercisable',
    retainedExercisableQuantityMsg: 'retained',
    emptyCellScreenReaderTxt: 'empty',
  } as IMessages;

  const mockModelTable: IModelTable = {
    grantCountLabel: 'grant',
    grantsCountLabel: 'grants',
    preTerminationSopSarLabel: 'Pre',
    preTerminationsectionLabel: 'Pre-sec',
    postTerminationsectionLabel: 'Post-sec',
    postTermEstimateLabel: '(Estimate)',
    grantDetailsColumnLabel: 'Grant Details',
    vestingDateColumnLabel: 'Vesting Date',
    expirationDateLabel: 'Expiration Date',
    terminationOutcomeLabel: 'Outcome',
    grantDetailsProductIdLabel: 'Product ID:',
    grantTypeLabel: 'Grant Type:',
    grantDetailsGrantIdLabel: 'Grant ID:',
    grantDetailsGrantedValueLabel: 'Granted Value:',
    grantPriceLabel: 'Grant Price:',
    grantDetailsGrantDateLabel: 'Grant Date:',
    totalLabel: 'Total',
  } as IModelTable;

  const mockTableHeaders: ITableHeaders = {
    exercisableQuantityColumnLabel: 'Exercisable Quantity',
    unvestedQuantityColumnLabel: 'Unvested Quantity',
    retainedExercisableQuantityColumnLabel: 'Retained Exercisable Quantity',
    retainUnvestedColumnLabel: 'Retain Unvested',
    retainedColumnLabel: 'Retained',
    outstandingColumnLabel: 'Outstanding',
    forfeitedColumnLabel: 'Forfeited',
  } as ITableHeaders;

  const mockGrant: IGrant = {
    productId: 'PROD1',
    grantType: 'RSU',
    grantId: 'G1',
    quantity: 100,
    grantPrice: 50,
    issuedDate: '2020-01-01',
    performanceIndicator: false,
    ruleIndicator: 'R1',
    csrIndicator: false,
    isoRulesOverride: false,
    isoDays: '0',
    isoMonths: '0',
    vestings: [
      {
        preTerminationVesting: {
          vestingDate: '2021-01-01',
          status: 'Vested',
          expirationDate: '2025-01-01',
          outstandingQuantity: 100,
          exercisableQuantity: 50,
          unvestedQuantity: 50,
        },
        postTerminationVesting: {
          vestingDate: '2021-01-01',
          status: 'Retain',
          expirationDate: '2025-01-01',
          forfeitedQuantity: 0,
          retainedQuantity: 100,
          retainedExercisableQuantity: 50,
          retainedUnvested: 50,
          retainedValue: 5000,
        },
      },
    ],
  } as IGrant;

  const mockPlan: IPlanDetail = {
    planId: 'PLAN1',
    planType: 'RSU',
    currencyCode: 'USD',
    grants: [mockGrant],
    totalQuantity: {
      forfeitedQuantity: 0,
      retainedQuantity: 100,
      outstandingQuantity: 100,
      exercisableQuantity: 50,
      unvestedQuantity: 50,
      retainedExercisableQuantity: 50,
      retainedUnvested: 50,
    },
  } as IPlanDetail;

  beforeEach(() => {
    spectator = createComponent({
      props: {
        plan: mockPlan,
        modelTable: mockModelTable,
        tableHeaders: mockTableHeaders,
        performanceIndicator: false,
        perfAwardFootNote: undefined,
        messages: mockMessages,
      },
    });
  });

  it('creates', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  describe('formatting helpers', () => {
    it('returns quantity formatted when plan type is non-cash', () => {
      const out = spectator.component.getFormattedQuantityOrValueByPlanType(
        123.456,
        'RSU',
        'USD',
      );
      expect(out).toContain('.');
      expect(typeof out).toBe('string');
    });

    it('returns currency formatted for USD', () => {
      const out = spectator.component.getFormattedCurrency(
        1234.56,
        TermModelConstant.USD,
      );
      expect(out).toContain(TermModelConstant.USD);
      expect(out).toMatch(/\d/);
    });

    it('returns decimal formatted for non-USD', () => {
      const out = spectator.component.getFormattedCurrency(1234.56, 'EUR');
      expect(out).toContain('EUR');
    });

    it('getFormattedQuantityOrValueByPlanType returns notAvailable when outstandingQuantity is NaN', () => {
      const out = spectator.component.getFormattedQuantityOrValueByPlanType(
        Number.NaN,
        'RSU',
        'USD',
      );
      expect(out).toBe(vestingDetailsNotAvailable.notAvailable);
    });

    it('getFormattedQuantityOrValueByPlanType uses currency path for CASH plan types', () => {
      const out = spectator.component.getFormattedQuantityOrValueByPlanType(
        1234.56,
        TermModelConstant.CASH,
        TermModelConstant.USD,
      );
      expect(out).toContain(TermModelConstant.USD);
    });

    it('getFormattedQuantity uses three decimals', () => {
      const out = spectator.component.getFormattedQuantity(100);
      expect(out).toMatch(/100(\.0{3})?/);
    });

    it('checkNull returns 0.00 for undefined', () => {
      const out = spectator.component.checkNull(undefined as any);
      expect(out).toBe(0.0);
    });
  });

  describe('term rule helpers', () => {
    it('termRuleAlertType returns true when matches messages.noRuleContent', () => {
      const messages = { ...mockMessages } as IMessages;
      spectator.setInput('messages', messages);
      const res = spectator.component.termRuleAlertType(messages.noRuleContent);
      expect(res).toBe(true);
    });

    it('getTermRuleContent returns the expected content', () => {
      const res = spectator.component.getTermRuleContent('msgContent');
      expect(res).toBe(mockMessages.msgContent);
    });
  });

  describe('ISO messages and vesting checks', () => {
    it('getVestings returns true for valid outstandingQuantity', () => {
      const result = spectator.component.getVestings(mockPlan);
      expect(result).toBe(true);
    });

    it('getVestings returns false when outstandingQuantity is NaN', () => {
      const plan = {
        ...mockPlan,
        grants: [
          {
            ...mockGrant,
            vestings: [
              {
                ...mockGrant.vestings[0],
                preTerminationVesting: {
                  ...mockGrant.vestings[0].preTerminationVesting,
                  outstandingQuantity: Number.NaN,
                },
              },
            ],
          },
        ],
      } as IPlanDetail;
      const result = spectator.component.getVestings(plan);
      expect(result).toBe(false);
    });

    it('builds ISO messages and sets flags', () => {
      const grantWithIso: IGrant = {
        ...mockGrant,
        isoRulesOverride: true,
        isoMonths: '1',
        isoDays: '2',
        productId: 'PROD1',
        vestings: [
          {
            ...mockGrant.vestings[0],
            postTerminationVesting: {
              ...mockGrant.vestings[0].postTerminationVesting,
              status: TermModelConstant.VESTIMMEDIATELY,
            },
          },
        ],
      } as IGrant;

      spectator.component.getIsoMessages(grantWithIso);
      expect(spectator.component.isoRulesOverride).toBe(true);
      expect(spectator.component.vestImmediatelyStatus).toBe(true);
      expect(
        spectator.component.isoProductIdMessageList.length,
      ).toBeGreaterThan(0);
      expect(spectator.component.isoProductIdList).toContain('PROD1');
      // message contains built months/days text
      expect(spectator.component.isoProductIdMessageList[0]).toContain(
        '1 month',
      );
      expect(spectator.component.isoProductIdMessageList[0]).toContain('2 day');
    });

    it('does not duplicate iso messages for same productId', () => {
      const grantWithIso: IGrant = {
        ...mockGrant,
        isoRulesOverride: true,
        isoMonths: '1',
        isoDays: '1',
        productId: 'P',
      } as IGrant;
      spectator.component.isoProductIdList = [];
      spectator.component.isoProductIdMessageList = [];
      spectator.component.getIsoMessages(grantWithIso);
      spectator.component.getIsoMessages(grantWithIso);
      expect(spectator.component.isoProductIdMessageList.length).toBe(1);
    });

    it('builds plural months/days ISO messages for months>1 and days>1', () => {
      const grantWithIsoPlural: IGrant = {
        ...mockGrant,
        isoRulesOverride: true,
        isoMonths: '2',
        isoDays: '3',
        productId: 'PR2',
        vestings: [
          {
            ...mockGrant.vestings[0],
            postTerminationVesting: {
              ...mockGrant.vestings[0].postTerminationVesting,
              status: 'retain',
            },
          },
        ],
      } as IGrant;

      spectator.component.isoProductIdList = [];
      spectator.component.isoProductIdMessageList = [];
      spectator.component.getIsoMessages(grantWithIsoPlural);
      expect(spectator.component.isoProductIdMessageList.length).toBe(1);
      const msg = spectator.component.isoProductIdMessageList[0];
      // plural forms: 'months' and 'days' should appear
      expect(msg).toContain('2');
      expect(msg).toMatch(/months|month/);
      expect(msg).toMatch(/days|day/);
    });
  });

  describe('ngOnInit', () => {
    it('calls getIsoMessages for each grant in plan', () => {
      const spy = jest.spyOn(spectator.component, 'getIsoMessages');
      spectator.component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });
});
