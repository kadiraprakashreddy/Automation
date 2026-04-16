import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'fmr-ap181424-participant-award-details',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  host: { class: 'fds-fds-theme' },
  imports: [RouterModule],
})
export class AppComponent {
  title =
    'sps-award-management-award-details-ap181424-participant-award-details';
}
