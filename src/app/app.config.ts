import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    injectSpriteSheet, PvdButton, PvdTitle, PvdFieldGroup, PvdSelect, PvdLink, PvdIcon, PvdLabel, PvdFootnotes,
    PvdFootnote, PvdAlert, PvdExpandCollapse, PvdSpinner
} from '@fmr-ap109253/providence';
import { FciHeaderStatusInterceptor, GlobalInterceptor } from '@fmr-ap123285/angular-utils';
import { routes } from './app.routes';
import { LibraryService } from './services/library.service';

const allHttpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: GlobalInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: FciHeaderStatusInterceptor,
    multi: true
  }
];

injectSpriteSheet();
PvdTitle.defineCustomElement();
PvdFieldGroup.defineCustomElement();
PvdSelect.defineCustomElement();
PvdButton.defineCustomElement();
PvdLink.defineCustomElement();
PvdLabel.defineCustomElement();
PvdIcon.defineCustomElement();
PvdFootnotes.defineCustomElement();
PvdFootnote.defineCustomElement();
PvdAlert.defineCustomElement();
PvdExpandCollapse.defineCustomElement();
PvdSpinner.defineCustomElement();

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: 'Window', useValue: window },
    LibraryService,
    ...allHttpInterceptorProviders,
    importProvidersFrom(
      BrowserAnimationsModule
    )
  ]
};