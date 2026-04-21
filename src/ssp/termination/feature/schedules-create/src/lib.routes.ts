import { Route } from '@angular/router';
import { SchedulesCreateComponent } from './schedules-create.component';

export const SchedulesCreateRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: SchedulesCreateComponent,
  },
];
