import { Routes } from '@angular/router';

const terminationManagementRoute = 'terminations';
export const appRoutes: Routes = [
  { path: '', redirectTo: terminationManagementRoute, pathMatch: 'full' },
  {
    loadChildren: () =>
      import('@fmr-ap160368/sps-termination-feature-terminations-root').then(
        (m) => m.LIB_ROUTES,
      ),
    path: 'terminations',
  },
];
