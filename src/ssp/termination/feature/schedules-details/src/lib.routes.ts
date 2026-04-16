import { Route } from '@angular/router';
import { SchedulesDetailsComponent } from './schedules-details.component';

export const SchedulesDetailsRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: SchedulesDetailsComponent,
  },
];
