import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  TERM_TYPE_OPTIONS,
  TERM_TYPE_PAGE_CONTENT,
  TermTypeStore,
  TermTypeValue,
} from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import {
  LabelComponent,
  RadioComponent,
  RadioGroupComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';

@Component({
  selector: 'sps-termination-term-type',
  templateUrl: './term-type.component.html',
  styleUrls: ['./term-type.component.scss'],
  imports: [
    LabelComponent,
    RadioGroupComponent,
    RadioComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermTypeComponent {
  readonly store = inject(TermTypeStore);
  readonly pageContent = TERM_TYPE_PAGE_CONTENT;
  readonly options = TERM_TYPE_OPTIONS;

  isOptionDisabled(value: TermTypeValue): boolean {
    return this.store.disabledTermTypeOptions()[value];
  }

  onTermTypeChange(value: TermTypeValue): void {
    if (this.isOptionDisabled(value)) {
      return;
    }
    this.store.setTermType(value);
  }
}
