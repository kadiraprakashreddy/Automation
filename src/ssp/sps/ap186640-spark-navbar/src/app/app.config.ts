import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { provideSharedCoreHostWeb } from '@fmr-ap167419/shared-core-data-access-host-web';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptorsFromDi()),

    provideSharedCoreHostWeb(),
  ],
};
