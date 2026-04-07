import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';
import { PvdDirectivesModule } from '@fmr-ap109253/providence-angular-directives';
import {
    FciHeaderStatusInterceptor,
    GlobalInterceptor
} from '@fmr-ap123285/angular-utils';
import { SparkNavbarModule } from '@fmr-ap137030/spark-navbar';
import {
    injectSpriteSheet,
    PvdAlert,
    PvdButton,
    PvdExpandCollapse,
    PvdFieldGroup,
    PvdFootnote,
    PvdFootnotes,
    PvdIcon,
    PvdLabel,
    PvdLink,
    PvdSelect,
    PvdSpinner,
    PvdTitle
} from '@fmr-ap109253/providence';
import { LibraryService } from './services/library.service';
import { routes } from './app.routes';

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
        provideRouter(routes, withHashLocation()),
        provideHttpClient(withInterceptorsFromDi()),
        importProvidersFrom(PvdDirectivesModule, SparkNavbarModule),
        { provide: 'Window', useValue: window },
        LibraryService,
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
    ]
};
