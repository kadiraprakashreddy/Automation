import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { Step2VestingMethodComponent } from './step-2-vesting-method.component';

describe('Step2VestingMethodComponent', () => {
  let spectator: Spectator<Step2VestingMethodComponent>;

  const createComponent = createComponentFactory({
    component: Step2VestingMethodComponent,
    shallow: true,
  });

  it('should create', () => {
    spectator = createComponent();
    expect(spectator.component).toBeTruthy();
  });
});
