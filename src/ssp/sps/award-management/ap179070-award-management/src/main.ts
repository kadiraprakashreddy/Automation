/* eslint-disable @nx/enforce-module-boundaries */
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import {
  EXPERIENCE_ID,
  getBaseHrefByExperienceIdFactory,
} from '@fmr-ap167419/shared-core-util-central-nav';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, importProvidersFrom, inject } from '@angular/core';
import { environment, mswWorker } from './environments/environment';
import { AppComponent } from './app/app.component';
import { RouterModule, provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { LIB_ROUTES } from '@fmr-ap160368/sps-award-management-feature-award-management-root';
import {
  BASE_PATH,
  provideEntContentDeliveryV1Api,
} from '@fmr-ap160368/shared-api-clients-data-access-ent-content-delivery-v1';
import { provideCoreExperienceContextWeb } from '@fmr-ap167419/shared-core-data-access-experience-context-web';
import { SpsAwardsManagementHttpInterceptor } from '@fmr-ap160368/sps-award-management-data-access-award-management-root';
import { provideFidHeaders } from '@fmr-ap167419/shared-api-clients-util-fid-header-interceptors';
import {
  ManageSubmissionDetailsService,
  ManageSubmissionDetailsServiceMockData,
} from '@fmr-ap160368/sps-award-management-data-access-manage-submission-details';
import { SERVICE_REQUEST_URL } from '@fmr-ap160368/sps-award-management-feature-manage-submission-details';
import { provideSpsFileManagementDecV1Api } from '@fmr-ap160368/shared-api-clients-data-access-sps-file-management-dec-v1';
import { SHARED_CORE_HOST_SERVICE_TOKEN } from '@fmr-ap167419/shared-core-data-access-host';
import { SHARED_CORE_RUNTIME_HOST_PATH } from '@fmr-ap167419/shared-core-data-access-runtime';
import { provideSharedCoreHostWeb } from '@fmr-ap167419/shared-core-data-access-host-web';

const commonProviders = [
  // must match experience-id mapping within central nav app
  provideHttpClient(withInterceptorsFromDi()),
  provideSharedCoreHostWeb(),
  {
    provide: EXPERIENCE_ID,
    useValue: 'psw-award-management',
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: SpsAwardsManagementHttpInterceptor,
    multi: true,
  },
  {
    provide: APP_BASE_HREF,
    useFactory: getBaseHrefByExperienceIdFactory,
    deps: [EXPERIENCE_ID, PlatformLocation],
  },
  {
    provide: ManageSubmissionDetailsService,
    useClass: ManageSubmissionDetailsServiceMockData,
  },
  importProvidersFrom(BrowserModule, RouterModule.forRoot(LIB_ROUTES)),
  provideCoreExperienceContextWeb(),
  provideEntContentDeliveryV1Api(),
  provideSpsFileManagementDecV1Api(() => ''),
  provideRouter(LIB_ROUTES),
  provideFidHeaders({
    appId: 'AP179070',
    appVersion: 'v1',
  }),
  {
    provide: BASE_PATH,
    useValue: '/ent-content-delivery/v1',
  },
  {
    provide: SERVICE_REQUEST_URL,
    useFactory: () => {
      const hostService = inject(SHARED_CORE_HOST_SERVICE_TOKEN);
      return (
        hostService.getHostMapping()['planSponsorLegacyHost'] +
        '/plansponsor/go/to/srlanding#/createcsr/home'
      );
    },
  },
];

if (environment.production) {
  enableProdMode();
  const providersList = [
    provideHttpClient(withInterceptorsFromDi()),
    provideSharedCoreHostWeb(),
    {
      provide: SHARED_CORE_RUNTIME_HOST_PATH,
      useFactory: () => {
        const hostService = inject(SHARED_CORE_HOST_SERVICE_TOKEN);
        return hostService.getWorkplaceDigitalHost();
      },
    },

    ...commonProviders,
  ];
  bootstrapApplication(AppComponent, {
    providers: providersList,
  }).catch((err) => console.error(err));
} else {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (mswWorker as any).start().then(() => {
    const providersList = [
      provideHttpClient(withInterceptorsFromDi()),
      {
        provide: SHARED_CORE_RUNTIME_HOST_PATH,
        useFactory: () => {
          return 'http://localhost:4200';
        },
      },
      ...commonProviders,
    ];
    bootstrapApplication(AppComponent, {
      providers: providersList,
    }).catch((err) => console.error(err));
  });
}
