import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantTaxDetailsRootModule } from '@fmr-ap160368/sps-tax-feature-participant-tax-details-root';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => {
      return ParticipantTaxDetailsRootModule;
    },
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
