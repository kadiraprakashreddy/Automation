import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AwardEducationRootModule } from '@fmr-ap160368/sps-education-feature-personalized-award-education-root';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => {
      return AwardEducationRootModule;
    },
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
