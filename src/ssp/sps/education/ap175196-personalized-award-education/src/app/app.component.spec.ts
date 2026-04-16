import { AppComponent } from './app.component';
import { Spectator, createRoutingFactory } from '@ngneat/spectator/jest';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createRoutingFactory(AppComponent);

  // Delete this test after adding real tests, and do the same
  // for all components, newly generated or not.
  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
