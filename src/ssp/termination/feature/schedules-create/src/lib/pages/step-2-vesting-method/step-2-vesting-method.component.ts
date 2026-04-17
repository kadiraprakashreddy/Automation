import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import {
  SCHEDULES_CREATE_PAGE_CONTENT,
  SchedulesCreateStore,
  VESTING_METHOD_OPTIONS,
  VestingMethod,
} from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import {
  LinkComponent,
  RadioComponent,
  RadioGroupComponent,
  TitleComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';
import { StepActionsComponent } from '../../shared/step-actions/step-actions.component';

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
  readonly store = inject(SchedulesCreateStore);

  readonly pageContent = SCHEDULES_CREATE_PAGE_CONTENT;
  readonly vestingMethodOptions = VESTING_METHOD_OPTIONS;

  readonly saveAndContinue = output<void>();
  readonly saveAndExit = output<void>();

  onVestingMethodChange(value: VestingMethod): void {
    if (this.store.disabledVestingOptions()[value]) {
      return;
    }
    this.store.setVestingMethod(value);
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
