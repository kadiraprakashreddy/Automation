import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TermTypeComponent } from './term-type.component';

describe('TermTypeComponent', () => {
  let spectator: Spectator<TermTypeComponent>;

  const createComponent = createComponentFactory({
    component: TermTypeComponent,
    shallow: true,
  });

  it('should create', () => {
    spectator = createComponent();
    expect(spectator.component).toBeTruthy();
  });
});
