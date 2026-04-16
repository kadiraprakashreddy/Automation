import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  EXPERIENCE_ID,
  getBaseHrefByExperienceIdFactory,
} from '@fmr-ap167419/shared-core-util-central-nav';

import { provideSharedCoreHostWeb } from '@fmr-ap167419/shared-core-data-access-host-web';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: EXPERIENCE_ID,
      useValue: 'nb-sps-private-longshares',
    },
    {
      provide: APP_BASE_HREF,
      useFactory: getBaseHrefByExperienceIdFactory,
      deps: [EXPERIENCE_ID, PlatformLocation],
    },
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideSharedCoreHostWeb(),
  ],
};
