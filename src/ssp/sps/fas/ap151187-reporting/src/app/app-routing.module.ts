import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootModule } from '@fmr-ap160368/sps-fas-feature-reporting-root';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => {
      return RootModule;
    },
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
