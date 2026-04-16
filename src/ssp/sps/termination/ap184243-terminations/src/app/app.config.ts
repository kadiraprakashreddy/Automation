import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { provideSharedCoreHostWeb } from '@fmr-ap167419/shared-core-data-access-host-web';
import {
  SubmitAnalyticsService,
  provideAppXsrfInterceptor,
  provideFciHeaderStatusInterceptor,
  provideWidInterceptor,
} from '@fmr-ap160368/sps-termination-data-access-management';
import { appRoutes } from './app.routes';
import { provideWiDateFnsAdapter } from '@fmr-ap167419/shared-design-system-ui-core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { enUS } from 'date-fns/locale';

export const appConfig: ApplicationConfig = {
  providers: [
    provideWiDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: enUS },
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAppXsrfInterceptor(),
    provideWidInterceptor(),
    provideFciHeaderStatusInterceptor(),
    provideSharedCoreHostWeb(),
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    DatePipe,
    SubmitAnalyticsService,
  ],
};
