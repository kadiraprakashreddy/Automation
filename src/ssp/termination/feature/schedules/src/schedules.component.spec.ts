import { SchedulesComponent } from './schedules.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { SchedulesStore } from '@fmr-ap160368/sps-termination-data-access-schedules';

describe('SchedulesComponent', () => {
  let spectator: Spectator<SchedulesComponent>;
  const createComponent = createComponentFactory({
    component: SchedulesComponent,
    providers: [],
    mocks: [SchedulesStore],
  });

  // Delete this test after adding real tests, and do the same
  // for all components, newly generated or not.
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
