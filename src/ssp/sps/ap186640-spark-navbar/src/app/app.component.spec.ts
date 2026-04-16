import { SpsSparkNavbarComponent } from '@fmr-ap160368/sps-feature-spark-navbar';
import { AppComponent } from './app.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { MockComponents } from 'ng-mocks';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [MockComponents(SpsSparkNavbarComponent)],
  });

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
