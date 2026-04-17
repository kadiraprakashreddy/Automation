import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { StepSummaryCardComponent } from './step-summary-card.component';

describe('StepSummaryCardComponent', () => {
  let spectator: Spectator<StepSummaryCardComponent>;

  const createComponent = createComponentFactory({
    component: StepSummaryCardComponent,
    shallow: true,
  });

  it('should create', () => {
    spectator = createComponent({
      props: {
        stepTitle: 'Step 1',
        stepDescription: 'Description',
        fields: [{ label: 'Key', value: 'Value' }],
      },
    });
    expect(spectator.component).toBeTruthy();
  });
});
