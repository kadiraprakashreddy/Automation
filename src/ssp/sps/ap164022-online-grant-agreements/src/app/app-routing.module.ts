import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootModule } from '@fmr-ap160368/sps-feature-online-grant-agreements-root';

const ogaSummaryRoute = '/spsGrantDocument/summary';

const routes: Routes = [
  { path: '', redirectTo: ogaSummaryRoute, pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => {
      return RootModule;
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
