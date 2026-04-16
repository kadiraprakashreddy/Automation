import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'fmr-ap179070-award-management',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  host: { class: 'fds-fds-theme' },
  imports: [RouterModule],
})
export class AppComponent {
  title = 'sps-award-management-ap179070-award-management';
}
