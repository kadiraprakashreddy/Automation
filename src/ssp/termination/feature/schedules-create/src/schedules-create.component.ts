import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import {
  SchedulesCreateStore,
  VESTING_METHOD_OPTIONS,
} from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import {
  LinkComponent,
  TitleComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';

import { Step1RuleLevelComponent } from './lib/pages/step-1-rule-level/step-1-rule-level.component';
import { Step2VestingMethodComponent } from './lib/pages/step-2-vesting-method/step-2-vesting-method.component';
import { StepSummaryCardComponent, StepSummaryField } from './lib/shared/step-summary-card/step-summary-card.component';

/** Progress percentage per step — update when more steps are wired */
const STEP_PROGRESS: Record<number, number> = {
  1: 5,
  2: 20,
};

/** Maps internal level value to display label */
const LEVEL_DISPLAY: Record<string, string> = {
  equity: 'Equity award',
  plan: 'Plan level',
  product: 'Product level',
};

@Component({
  selector: 'sps-termination-schedules-create',
  templateUrl: './schedules-create.component.html',
  styleUrls: ['./schedules-create.component.scss'],
  imports: [
    LinkComponent,
    TitleComponent,
    StepSummaryCardComponent,
    Step1RuleLevelComponent,
    Step2VestingMethodComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesCreateComponent {
  private readonly store = inject(SchedulesCreateStore);

  /** Tracks the active wizard step (1-based). Local until store is wired. */
  protected readonly currentStep = signal<number>(1);

  /** Progress bar percentage for the current step */
  protected readonly progressPercent = computed(
    () => STEP_PROGRESS[this.currentStep()] ?? 0,
  );

  /** Hide progress bar on the final review step */
  protected readonly showProgressBar = computed(() => this.currentStep() <= 2);

  /** Summary fields for the collapsed Step 1 card */
  protected readonly step1SummaryFields = computed<StepSummaryField[]>(() => {
    const form = this.store.formState();
    const fields: StepSummaryField[] = [
      { label: 'Level', value: LEVEL_DISPLAY[form.level] ?? form.level },
    ];
    if (form.terminationEquityType) {
      fields.push({ label: 'Equity award type', value: form.terminationEquityType });
    }
    if (form.terminationRuleId) {
      fields.push({ label: 'Term rule ID', value: form.terminationRuleId });
    }
    if (form.terminationRuleName) {
      fields.push({ label: 'Term rule name', value: form.terminationRuleName });
    }
    return fields;
  });

  /** Collapsed Step 2 summary when past vesting (same pattern as Step 1). */
  protected readonly step2SummaryFields = computed<StepSummaryField[]>(() => {
    const vm = this.store.vestingMethod();
    if (!vm) {
      return [{ label: 'Vesting method', value: '—' }];
    }
    const option = VESTING_METHOD_OPTIONS.find((o) => o.value === vm);
    return [
      {
        label: 'Vesting method',
        value: option?.title ?? vm,
      },
    ];
  });

  /** Navigate to a specific step */
  goToStep(step: number): void {
    this.currentStep.set(step);
  }
}
