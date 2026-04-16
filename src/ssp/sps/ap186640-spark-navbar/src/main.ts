import { ApplicationRef, enableProdMode } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

import type { SetupWorker } from 'msw/browser';

import { environment, mswWorker } from './environments/environment';
import { AppComponent } from './app/app.component';

import { appConfig } from './app/app.config';

(async () => {
  try {
    if (environment.production) {
      enableProdMode();
    } else {
      await (mswWorker as unknown as SetupWorker).start();
    }

    const app: ApplicationRef = await createApplication(appConfig);
    const appElement = createCustomElement(AppComponent, {
      injector: app.injector,
    });
    customElements.define('fmr-ap186640-spark-navbar-ae', appElement);
  } catch (err) {
    console.error(err);
  }
})();
