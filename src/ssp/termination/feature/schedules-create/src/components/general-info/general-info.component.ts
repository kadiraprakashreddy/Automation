import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  EQUITY_AWARD_OPTIONS,
  GENERAL_INFO_AUTOCOMPLETE_ITEMS,
  GENERAL_INFO_PAGE_CONTENT,
  GeneralInfoStore,
  RULE_LEVEL_OPTIONS,
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

@Component({
  selector: 'sps-termination-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
  imports: [
    CommonModule,
    FormComponent,
    AutocompleteComponent,
    LabelComponent,
    InputComponent,
    SelectComponent,
    TooltipComponent,
    TitleComponent,
    IconModule,
    RadioGroupComponent,
    RadioComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoComponent {
  readonly store = inject(GeneralInfoStore);
  readonly pageContent = GENERAL_INFO_PAGE_CONTENT;
  readonly levelOptions = RULE_LEVEL_OPTIONS;
  readonly planIdAutocompleteOptions = GENERAL_INFO_AUTOCOMPLETE_ITEMS;
  readonly productIdAutocompleteOptions = GENERAL_INFO_AUTOCOMPLETE_ITEMS;
  readonly equityAwardOptions = EQUITY_AWARD_OPTIONS;
  protected readonly iconSize = Size;
  protected readonly layerPosition = LayerPosition;
  protected readonly autocompleteMinLength = 1;

  /**
   * Check if product level is currently selected
   * @returns true if current level is product
   */
  isProductLevel(): boolean {
    return this.store.currentLevel() === 'product';
  }

  /**
   * Check if plan level is currently selected
   * @returns true if current level is plan
   */
  isPlanLevel(): boolean {
    return this.store.currentLevel() === 'plan';
  }

  /**
   * Handle rule level change event
   * @param level - The selected rule level
   */
  onLevelChange(level: 'equity' | 'plan' | 'product'): void {
    this.store.onLevelChange(level);
  }

  onTerminationEquityTypeChange(value: string): void {
    this.store.updateFormField('terminationEquityType', value);
  }

  /**
   * Handle Equity award options
   */
  getEquityAwardSelectOptions(): SelectOption[] {
    const options = this.equityAwardOptions.map((award) => ({
      value: award,
      text: award,
    }));
    return [
      {
        value: '',
        text: this.pageContent.equityAwardSelectOneLabel,
      },
      ...options,
    ];
  }
}
