import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    loadChildren: () =>
      import(
        '@fmr-ap160368/sps-private-market-feature-private-long-shares-root'
      ).then((m) => m.LIB_ROUTES),
    path: '',
    pathMatch: 'full',
  },
];
