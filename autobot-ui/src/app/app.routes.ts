import { Routes } from '@angular/router';
import { RuleBuilderComponent } from './components/rule-builder/rule-builder.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'builder', component: RuleBuilderComponent },
  { path: '**', redirectTo: '/dashboard' }
];