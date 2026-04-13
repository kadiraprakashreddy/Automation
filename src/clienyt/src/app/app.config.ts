import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
<<<<<<< HEAD
=======
import { FormsModule } from '@angular/forms';
>>>>>>> f9c682553801ec636e86a393a5edcd06affa3dcf
import {
    injectSpriteSheet, PvdButton, PvdTitle, PvdFieldGroup, PvdSelect, PvdLink, PvdIcon, PvdLabel, PvdFootnotes,
    PvdFootnote, PvdAlert, PvdExpandCollapse, PvdSpinner
} from '@fmr-ap109253/providence';
<<<<<<< HEAD
import { FciHeaderStatusInterceptor, GlobalInterceptor } from '@fmr-ap123285/angular-utils';
=======
import { PvdDirectivesModule } from '@fmr-ap109253/providence-angular-directives';
import { SparkNavbarModule } from '@fmr-ap137030/spark-navbar';
import { FciHeaderStatusInterceptor, GlobalInterceptor } from '@fmr-ap123285/angular-utils';
import { VideoModule } from '@fmr-ap137030/video-component';
>>>>>>> f9c682553801ec636e86a393a5edcd06affa3dcf
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
<<<<<<< HEAD
      BrowserAnimationsModule
=======
      BrowserAnimationsModule,
      FormsModule,
      PvdDirectivesModule,
      SparkNavbarModule,
      VideoModule
>>>>>>> f9c682553801ec636e86a393a5edcd06affa3dcf
    )
  ]
};