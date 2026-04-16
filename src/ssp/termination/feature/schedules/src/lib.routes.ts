import { Route } from '@angular/router';
import { SchedulesComponent } from './schedules.component';

export const SchedulesRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: SchedulesComponent,
  },
];
