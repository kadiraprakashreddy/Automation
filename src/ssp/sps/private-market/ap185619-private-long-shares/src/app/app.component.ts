import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'fmr-ap185619-private-long-shares',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  host: { class: 'fds-fds-theme' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'sps-private-market-ap185619-private-long-shares';
}
