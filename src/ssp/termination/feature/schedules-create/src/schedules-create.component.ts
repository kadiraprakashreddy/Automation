import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { TermTypeComponent } from './components/term-type/term-type.component';

import {
  SCHEDULES_CREATE_ACTION_LABELS,
  SCHEDULES_CREATE_PAGE_CONTENT,
  SchedulesCreateStore,
} from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import {
  ButtonComponent,
  ButtonVariant,
  FormActionsComponent,
  Inline,
  TitleComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';

@Component({
  selector: 'sps-termination-schedules-create',
  templateUrl: './schedules-create.component.html',
  styleUrls: ['./schedules-create.component.scss'],
  imports: [
    GeneralInfoComponent,
    TermTypeComponent,
    FormActionsComponent,
    ButtonComponent,
    TitleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesCreateComponent {
  readonly store = inject(SchedulesCreateStore);
  readonly actionLabels = SCHEDULES_CREATE_ACTION_LABELS;
  readonly pageTitle = SCHEDULES_CREATE_PAGE_CONTENT.pageHeader;
  protected readonly buttonVariant = ButtonVariant;
  protected readonly inline = Inline;

  /**
   * Handle submit button click
   */
  onSubmit(): void {
    // TODO: submit logic
  }

  /**
   * Handle cancel button click
   */
  onCancel(): void {
    // TODO: cancel logic
  }
}
