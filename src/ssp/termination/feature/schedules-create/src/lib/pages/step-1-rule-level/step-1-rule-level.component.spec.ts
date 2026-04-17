import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { Step1RuleLevelComponent } from './step-1-rule-level.component';

describe('Step1RuleLevelComponent', () => {
  let spectator: Spectator<Step1RuleLevelComponent>;

  const createComponent = createComponentFactory({
    component: Step1RuleLevelComponent,
    shallow: true,
  });

  it('should create', () => {
    spectator = createComponent();
    expect(spectator.component).toBeTruthy();
  });
});
