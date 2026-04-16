import { AppComponent } from './app.component';
import { Spectator, createRoutingFactory } from '@ngneat/spectator/jest';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createRoutingFactory(AppComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
