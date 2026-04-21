import { Routes } from '@angular/router';
import { RootComponent } from './root.component';
import { ManagementRoutes } from '@fmr-ap160368/sps-termination-feature-management';
import { SchedulesRoutes } from '@fmr-ap160368/sps-termination-feature-schedules';
import { SchedulesDetailsRoutes } from '@fmr-ap160368/sps-termination-feature-schedules-details';
import { SchedulesCreateRoutes } from '@fmr-ap160368/sps-termination-feature-schedules-create';
import {
  participantTerminationsGuard,
  terminationRulesGuard,
} from './utils/entry-context.guard';

export const LIB_ROUTES: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        ...ManagementRoutes[0],
        canMatch: [participantTerminationsGuard],
      },
      {
        path: 'schedules',
        canMatch: [terminationRulesGuard],
        children: SchedulesRoutes,
      },
      {
        path: 'details',
        canMatch: [terminationRulesGuard],
        children: SchedulesDetailsRoutes,
      },
      {
        path: 'create',
        canMatch: [terminationRulesGuard],
        children: SchedulesCreateRoutes,
      },
    ],
  },
];
