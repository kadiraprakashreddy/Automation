/* eslint-disable */
import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { SetupWorker } from 'msw/browser';
import { environment, mswWorker } from './environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
  platformBrowser()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
} else {
  (mswWorker as unknown as SetupWorker).start().then(() => {
    platformBrowser()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  });
}

declare let __webpack_public_path__: string;

__webpack_public_path__ = (<any>window).STATIC_CONTENT_LOCATION
  ? (<any>window).STATIC_CONTENT_LOCATION
  : '';
