import { Route } from '@angular/router';
import { SchedulesCopyComponent } from './schedules-copy.component';

export const SchedulesCopyRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: SchedulesCopyComponent,
  },
];
