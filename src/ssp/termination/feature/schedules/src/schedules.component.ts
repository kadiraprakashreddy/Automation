import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SchedulesStore } from '@fmr-ap160368/sps-termination-data-access-schedules';

@Component({
  selector: 'sps-termination-schedules',
  templateUrl: './schedules.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesComponent {
  store = inject(SchedulesStore);
}
