import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import type { SetupWorker } from 'msw/browser';

import { environment, mswWorker } from './environments/environment';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (environment.production) {
  enableProdMode();
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err),
  );
} else {
  (mswWorker as unknown as SetupWorker).start().then(() => {
    bootstrapApplication(AppComponent, appConfig).catch((err) =>
      console.error(err),
    );
  });
}
