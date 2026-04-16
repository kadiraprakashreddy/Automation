import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'fmr-ap151187-reporting',
  template: `<router-outlet></router-outlet>`,
  standalone: false,
  host: { class: 'fds-fds-theme' },
})
export class AppComponent {
  title = 'sps-fas-ap151187-reporting';
}
