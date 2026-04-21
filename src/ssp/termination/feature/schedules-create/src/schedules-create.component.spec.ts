import { SchedulesCreateComponent } from './schedules-create.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { SchedulesCreateStore } from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import { GeneralInfoComponent } from './components/general-info/general-info.component';

describe('SchedulesCreateComponent', () => {
  let spectator: Spectator<SchedulesCreateComponent>;
  const createComponent = createComponentFactory({
    component: SchedulesCreateComponent,
    providers: [],
    mocks: [SchedulesCreateStore],
    imports: [GeneralInfoComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  // Delete this test after adding real tests, and do the same
  // for all components, newly generated or not.
  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render the general-info component', () => {
    expect(spectator.query('sps-termination-general-info')).toExist();
  });

  it('should render the page header title', () => {
    expect(spectator.query('header wi-ds-title h1')).toHaveText(
      'Create a termination rule',
    );
  });

  it('should render shared form actions with three buttons', () => {
    expect(spectator.query('wi-ds-form-actions')).toExist();
    expect(spectator.queryAll('wi-ds-form-actions wi-ds-button')).toHaveLength(
      3,
    );
    expect(spectator.query('[pvd-id="save-and-continue-button"]')).toHaveText(
      'Save and continue',
    );
    expect(spectator.query('[pvd-id="save-and-exit-button"]')).toHaveText(
      'Save and exit',
    );
    expect(spectator.query('[pvd-id="cancel-button"]')).toHaveText('Cancel');
  });

  it('should execute moved action handlers without errors', () => {
    expect(() => spectator.component.onSaveAndContinue()).not.toThrow();
    expect(() => spectator.component.onSaveAndExit()).not.toThrow();
    expect(() => spectator.component.onCancel()).not.toThrow();
  });
});
