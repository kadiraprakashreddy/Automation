import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SchedulesCopyStore } from '@fmr-ap160368/sps-termination-data-access-schedules-copy';

@Component({
  selector: 'sps-termination-schedules-copy',
  templateUrl: './schedules-copy.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchedulesCopyComponent {
  store = inject(SchedulesCopyStore);
}
