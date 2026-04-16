import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IconModule,
  LinkModule,
  LoadingIndicatorModule,
} from '@fmr-ap167419/shared-design-system-ui-core';
import {
  ManagementStore,
  SubmitAnalyticsService,
  TruncatePipe,
} from '@fmr-ap160368/sps-termination-data-access-management';
import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  SlicePipe,
} from '@angular/common';
import { SpsTerminationFeatureManagementManageTerminationComponent } from './components/manage-termination/manage-termination.component';

@Component({
  selector: 'sps-termination-management',
  templateUrl: './management.component.html',
  styles: [],
  imports: [
    SpsTerminationFeatureManagementManageTerminationComponent,
    IconModule,
    LinkModule,
    LoadingIndicatorModule,
  ],
  providers: [
    ManagementStore,
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    SlicePipe,
    TruncatePipe,
    SubmitAnalyticsService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementComponent {
  store = inject(ManagementStore);
}
