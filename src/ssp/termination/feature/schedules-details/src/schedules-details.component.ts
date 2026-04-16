import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SchedulesDetailsStore } from '@fmr-ap160368/sps-termination-data-access-schedules-details';

@Component({
  selector: 'sps-termination-schedules-details',
  templateUrl: './schedules-details.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesDetailsComponent {
  store = inject(SchedulesDetailsStore);
}
