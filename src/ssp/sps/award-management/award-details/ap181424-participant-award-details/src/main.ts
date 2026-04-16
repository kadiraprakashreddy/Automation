import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  EXPERIENCE_ID,
  getBaseHrefByExperienceIdFactory,
} from '@fmr-ap167419/shared-core-util-central-nav';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { RouterModule, provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { LIB_ROUTES } from '@fmr-ap160368/sps-award-management-award-details-feature-participant-award-details-root';
import { provideSharedCoreHostWeb } from '@fmr-ap167419/shared-core-data-access-host-web';
import { provideCoreExperienceContextWeb } from '@fmr-ap167419/shared-core-data-access-experience-context-web';
import { provideFidHeaders } from '@fmr-ap167419/shared-api-clients-util-fid-header-interceptors';

const providers = [
  // must match experience-id mapping within central nav app
  provideHttpClient(withInterceptorsFromDi()),
  provideSharedCoreHostWeb(),
  {
    provide: EXPERIENCE_ID,
    useValue: 'psw-participant-award-details',
  },
  {
    provide: APP_BASE_HREF,
    useFactory: getBaseHrefByExperienceIdFactory,
    deps: [EXPERIENCE_ID, PlatformLocation],
  },
  importProvidersFrom(BrowserModule, RouterModule.forRoot(LIB_ROUTES)),
  provideCoreExperienceContextWeb(),
  provideRouter(LIB_ROUTES),
  provideFidHeaders({
    appId: 'AP181424',
    appVersion: 'v1',
  }),
];

if (environment.production) {
  enableProdMode();
  bootstrapApplication(AppComponent, { providers }).catch((err) =>
    console.error(err),
  );
} else {
  // (mswWorker as any).start().then(() => {
  bootstrapApplication(AppComponent, { providers }).catch((err) =>
    console.error(err),
  );
  // });
}
