/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

import { SpsTerminationFeatureManagementOtherAwardTableComponent } from './other-award-table.component';
import {
  TermModelConstant,
  vestingDetailsNotAvailable,
} from '@fmr-ap160368/sps-termination-data-access-management';

describe('SpsTerminationFeatureManagementOtherAwardTableComponent', () => {
  let spectator: Spectator<SpsTerminationFeatureManagementOtherAwardTableComponent>;
  const createComponent = createComponentFactory({
    component: SpsTerminationFeatureManagementOtherAwardTableComponent,
    detectChanges: false,
    providers: [CurrencyPipe, DecimalPipe],
  });

  const mockPlan = {
    grants: [],
  } as any;

  const mockModelTable = {} as any;
  const mockTableHeaders = {} as any;
  const mockMessages = {
    noRuleContent: 'NO_RULE',
    someRule: 'SOME_RULE',
  } as any;

  beforeEach(() => {
    spectator = createComponent({
      props: {
        plan: (() => mockPlan) as unknown as any,
        modelTable: (() => mockModelTable) as unknown as any,
        tableHeaders: (() => mockTableHeaders) as unknown as any,
        performanceIndicator: (() => false) as unknown as any,
        perfAwardFootNote: (() => undefined) as unknown as any,
        messages: (() => mockMessages) as unknown as any,
      },
    });
    // Ensure the runtime input signal returns our mock messages when invoked
    (spectator.component as unknown as any).messages = (() =>
      mockMessages) as any;
  });

  it('checkNull returns 0.00 for undefined and same number for defined', () => {
    const comp = spectator.component;
    expect(comp.checkNull(undefined)).toBe(0.0);
    expect(comp.checkNull(12.34)).toBe(12.34);
  });

  it('getFormattedQuantity formats to 3 decimals', () => {
    const comp = spectator.component;
    const out = comp.getFormattedQuantity(1);
    expect(out).toBe('1.000');
  });

  it('getFormattedCurrency for USD uses currency pipe and appends code', () => {
    const comp = spectator.component;
    const res = comp.getFormattedCurrency(1234.5, TermModelConstant.USD);
    expect(res).toContain('USD');
  });

  it('getFormattedCurrency for non-USD uses decimal pipe and appends code', () => {
    const comp = spectator.component;
    const res = comp.getFormattedCurrency(1234.5, 'EUR');
    expect(res).toContain('EUR');
  });

  it('getFormattedQuantityOrValueByPlanType returns vesting not available for NaN', () => {
    const comp = spectator.component;
    const res = comp.getFormattedQuantityOrValueByPlanType(
      NaN as unknown as number,
      TermModelConstant.CASH,
      'USD',
    );
    expect(res).toBe(vestingDetailsNotAvailable.notAvailable);
  });

  it('getFormattedQuantityOrValueByPlanType returns currency for cash plan', () => {
    const comp = spectator.component;
    const res = comp.getFormattedQuantityOrValueByPlanType(
      100,
      TermModelConstant.CASH,
      'USD',
    );
    expect(res).toContain('USD');
  });

  it('getFormattedQuantityOrValueByPlanType returns quantity for non-cash plan', () => {
    const comp = spectator.component;
    const res = comp.getFormattedQuantityOrValueByPlanType(10, 'OTHER', 'USD');
    expect(res).toBe('10.000');
  });

  it('termRuleAlertType and getTermRuleContent work with messages', () => {
    const comp = spectator.component;
    expect(comp.termRuleAlertType('NO_RULE')).toBe(true);
    expect(comp.termRuleAlertType('SOMETHING_ELSE')).toBe(false);
    expect(comp.getTermRuleContent('someRule')).toBe(mockMessages['someRule']);
  });

  describe('getVestings', () => {
    it('returns true when no vestings', () => {
      const comp = spectator.component;
      const result = comp.getVestings({ grants: [] } as any);
      expect(result).toBe(true);
    });

    it('returns true when outstandingQuantity is undefined', () => {
      const comp = spectator.component;
      const plans = {
        grants: [
          {
            vestings: [
              { preTerminationVesting: { outstandingQuantity: undefined } },
            ],
          },
        ],
      } as any;
      expect(comp.getVestings(plans)).toBe(true);
    });

    it('returns false when outstandingQuantity is NaN', () => {
      const comp = spectator.component;
      const plans = {
        grants: [
          {
            vestings: [{ preTerminationVesting: { outstandingQuantity: NaN } }],
          },
        ],
      } as any;
      expect(comp.getVestings(plans)).toBe(false);
    });

    it('handles multiple grants and vestings', () => {
      const comp = spectator.component;
      const plans = {
        grants: [
          { vestings: [{ preTerminationVesting: { outstandingQuantity: 0 } }] },
          { vestings: [{ preTerminationVesting: { outstandingQuantity: 1 } }] },
        ],
      } as any;
      expect(comp.getVestings(plans)).toBe(true);
    });
  });
});
