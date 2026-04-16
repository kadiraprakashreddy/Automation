import { SchedulesCopyComponent } from './schedules-copy.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { SchedulesCopyStore } from '@fmr-ap160368/sps-termination-data-access-schedules-copy';

describe('SchedulesCopyComponent', () => {
  let spectator: Spectator<SchedulesCopyComponent>;
  const createComponent = createComponentFactory({
    component: SchedulesCopyComponent,
    providers: [],
    mocks: [SchedulesCopyStore],
  });

  // Delete this test after adding real tests, and do the same
  // for all components, newly generated or not.
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
