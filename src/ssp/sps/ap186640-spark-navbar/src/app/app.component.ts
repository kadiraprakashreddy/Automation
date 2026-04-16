import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpsSparkNavbarComponent } from '@fmr-ap160368/sps-feature-spark-navbar';

@Component({
  selector: 'fmr-ap186640-spark-navbar',
  template: `<sps-spark-navbar></sps-spark-navbar>`,
  styles: [''],
  host: { class: 'fds-fds-theme' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpsSparkNavbarComponent],
})
export class AppComponent {}
