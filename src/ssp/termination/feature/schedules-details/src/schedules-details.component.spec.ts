import { SchedulesDetailsComponent } from './schedules-details.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { SchedulesDetailsStore } from '@fmr-ap160368/sps-termination-data-access-schedules-details';

describe('SchedulesDetailsComponent', () => {
  let spectator: Spectator<SchedulesDetailsComponent>;
  const createComponent = createComponentFactory({
    component: SchedulesDetailsComponent,
    providers: [],
    mocks: [SchedulesDetailsStore],
  });

  // Delete this test after adding real tests, and do the same
  // for all components, newly generated or not.
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
