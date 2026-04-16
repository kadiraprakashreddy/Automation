import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ButtonComponent, ButtonVariant } from '@fmr-ap167419/shared-design-system-ui-core';

export interface StepSummaryField {
  label: string;
  value: string;
}

@Component({
  selector: 'sps-termination-step-summary-card',
  templateUrl: './step-summary-card.component.html',
  styleUrls: ['./step-summary-card.component.scss'],
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepSummaryCardComponent {
  readonly stepTitle = input.required<string>();
  readonly stepDescription = input.required<string>();
  readonly fields = input.required<StepSummaryField[]>();

  readonly editClicked = output<void>();

  protected readonly buttonVariant = ButtonVariant;

  onEdit(): void {
    this.editClicked.emit();
  }
}
