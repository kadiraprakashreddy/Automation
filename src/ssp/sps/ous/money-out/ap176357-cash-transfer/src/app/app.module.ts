import { DoBootstrap, Injector, NgModule, inject } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { provideSharedCoreHostWeb } from '@fmr-ap167419/shared-core-data-access-host-web';
import { provideCoreAnalyticsWeb } from '@fmr-ap167419/shared-core-data-access-analytics-web';
import { AppComponent } from './app.component';
import { SpsOusMoneyOutCashTransferModule } from '@fmr-ap160368/sps-ous-money-out-feature-cash-transfer';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SpsOusMoneyOutCashTransferModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideSharedCoreHostWeb(),
    provideCoreAnalyticsWeb(),
  ],
})
export class AppModule implements DoBootstrap {
  private injector = inject(Injector);

  ngDoBootstrap() {
    const AppElement = createCustomElement(AppComponent, {
      injector: this.injector,
    });

    customElements.define('fmr-ap176357-cash-transfer-ae', AppElement);
  }
}
