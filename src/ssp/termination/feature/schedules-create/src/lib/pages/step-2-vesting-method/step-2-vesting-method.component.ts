import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

import {
  SCHEDULES_CREATE_PAGE_CONTENT,
  VESTING_METHOD_OPTIONS,
  VestingMethod,
} from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import {
  LinkComponent,
  RadioComponent,
  RadioGroupComponent,
  TitleComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';
import { StepActionsComponent } from '../../shared';

@Component({
  selector: 'sps-termination-step-2-vesting-method',
  templateUrl: './step-2-vesting-method.component.html',
  styleUrls: ['./step-2-vesting-method.component.scss'],
  imports: [
    TitleComponent,
    LinkComponent,
    RadioGroupComponent,
    RadioComponent,
    StepActionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step2VestingMethodComponent {
  readonly pageContent = SCHEDULES_CREATE_PAGE_CONTENT;
  readonly vestingMethodOptions = VESTING_METHOD_OPTIONS;

  readonly saveAndContinue = output<void>();
  readonly saveAndExit = output<void>();

  /** Tracks the currently selected vesting method. */
  protected readonly selectedVestingMethod = signal<VestingMethod | null>(null);

  /**
   * RSA award type — disables Defer option.
   * TODO: wire to store when data-access is ready.
   */
  protected readonly isRSA = signal<boolean>(false);

  /**
   * Proration assigned flag — disables Forfeit option.
   * TODO: wire to store when data-access is ready.
   */
  protected readonly isProrationAssigned = signal<boolean>(false);

  /**
   * Returns true when a given option should be disabled.
   * Forfeit is disabled when proration is assigned.
   * Defer is disabled when equity type is RSA.
   */
  isOptionDisabled(value: VestingMethod): boolean {
    if (value === 'forfeit' && this.isProrationAssigned()) {
      return true;
    }
    if (value === 'defer' && this.isRSA()) {
      return true;
    }
    return false;
  }

  onVestingMethodChange(value: VestingMethod): void {
    this.selectedVestingMethod.set(value);
    // TODO: wire to store — store.onVestingMethodChange(value)
  }

  onSaveAndExit(): void {
    this.saveAndExit.emit();
  }

  onSaveAndContinue(): void {
    this.saveAndContinue.emit();
  }

  onCancel(): void {
    // TODO: wire to store
  }
}
