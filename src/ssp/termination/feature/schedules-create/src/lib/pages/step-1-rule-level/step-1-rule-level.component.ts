import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

import {
  EQUITY_AWARD_OPTIONS,
  RULE_LEVEL_OPTIONS,
  SCHEDULES_CREATE_AUTOCOMPLETE_ITEMS,
  SCHEDULES_CREATE_PAGE_CONTENT,
  SchedulesCreateStore,
} from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import {
  AutocompleteComponent,
  FormComponent,
  IconModule,
  InputComponent,
  LabelComponent,
  LayerPosition,
  RadioComponent,
  RadioGroupComponent,
  SelectComponent,
  SelectOption,
  Size,
  TitleComponent,
  TooltipComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';
import { StepActionsComponent } from '../../shared/step-actions/step-actions.component';

@Component({
  selector: 'sps-termination-step-1-rule-level',
  templateUrl: './step-1-rule-level.component.html',
  styleUrls: ['./step-1-rule-level.component.scss'],
  imports: [
    FormComponent,
    AutocompleteComponent,
    LabelComponent,
    InputComponent,
    SelectComponent,
    TooltipComponent,
    StepActionsComponent,
    TitleComponent,
    IconModule,
    RadioGroupComponent,
    RadioComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Step1RuleLevelComponent {
  readonly store = inject(SchedulesCreateStore);

  readonly saveAndContinue = output<void>();
  readonly saveAndExit = output<void>();
  readonly pageContent = SCHEDULES_CREATE_PAGE_CONTENT;
  readonly levelOptions = RULE_LEVEL_OPTIONS;
  readonly planIdAutocompleteOptions = SCHEDULES_CREATE_AUTOCOMPLETE_ITEMS;
  readonly productIdAutocompleteOptions = SCHEDULES_CREATE_AUTOCOMPLETE_ITEMS;
  readonly equityAwardOptions = EQUITY_AWARD_OPTIONS;

  protected readonly iconSize = Size;
  protected readonly layerPosition = LayerPosition;
  protected readonly autocompleteMinLength = 1;

  getEquityAwardSelectOptions(): SelectOption[] {
    const options = this.equityAwardOptions.map((award: string) => ({
      value: award,
      text: award,
    }));
    return [{ value: '', text: this.pageContent.equityAwardSelectOneLabel }, ...options];
  }

  onLevelChange(level: 'equity' | 'plan' | 'product'): void {
    this.store.onLevelChange(level);
  }

  onTerminationEquityTypeChange(value: string): void {
    this.store.updateFormField('terminationEquityType', value);
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
