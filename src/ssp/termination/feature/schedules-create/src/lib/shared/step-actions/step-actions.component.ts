import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import {
  SCHEDULES_CREATE_PAGE_CONTENT,
} from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import {
  ButtonComponent,
  ButtonVariant,
  FormActionsComponent,
  Inline,
} from '@fmr-ap167419/shared-design-system-ui-core';

@Component({
  selector: 'sps-termination-step-actions',
  templateUrl: './step-actions.component.html',
  styleUrls: ['./step-actions.component.scss'],
  imports: [ButtonComponent, FormActionsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepActionsComponent {
  readonly pageContent = SCHEDULES_CREATE_PAGE_CONTENT;

  readonly saveAndContinue = output<void>();
  readonly saveAndExit = output<void>();
  readonly cancel = output<void>();

  protected readonly buttonVariant = ButtonVariant;
  protected readonly inline = Inline;
}
