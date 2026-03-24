import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, provideZoneChangeDetection } from '@angular/core';
import { LibraryService } from './services/library.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChapterComponent } from './components/chapters/chapter.component';
import { ParagraphComponent } from './components/paragraph/paragraph.component';
import { LibraryComponent } from './components/library/library.component';
import {
    injectSpriteSheet, PvdButton, PvdTitle, PvdFieldGroup, PvdSelect, PvdLink, PvdIcon, PvdLabel, PvdFootnotes,
    PvdFootnote, PvdAlert, PvdExpandCollapse, PvdSpinner
} from '@fmr-ap109253/providence';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PvdDirectivesModule } from '@fmr-ap109253/providence-angular-directives';
import { FormsModule } from '@angular/forms';
import { AngularUtilsModule, FciHeaderStatusInterceptor, GlobalInterceptor } from '@fmr-ap123285/angular-utils';
import { SparkNavbarModule } from '@fmr-ap137030/spark-navbar';
import { VideoModule } from '@fmr-ap137030/video-component';

/**
 * @copyright 2020-2021, FMR LLC
 * @file Parent module for Help and Learning
 * @author Preeti Chaurasia (a634796)
 */

injectSpriteSheet(); // required if you are using any component that renders an icon
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

const allHttpInterceptorProviders = [
    // adds 'Content-Type' : 'application/json' header to all
    // requests unless a content-type is already specified
    {
        provide: HTTP_INTERCEPTORS,
        useClass: GlobalInterceptor,
        multi: true
    },
    // throws HttpErrorResponse if 'fid-ws-http-status' header
    // is present and is < 200 or > 299
    {
        provide: HTTP_INTERCEPTORS,
        useClass: FciHeaderStatusInterceptor,
        multi: true
    }
];

@NgModule({
    declarations: [
        AppComponent,
        ChapterComponent,
        ParagraphComponent,
        LibraryComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
        PvdDirectivesModule,
        SparkNavbarModule,
        AngularUtilsModule,
        VideoModule
        // HttpClientModule removed — replaced by provideHttpClient() in providers
    ],
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: 'Window', useValue: window },
        LibraryService,
        ...allHttpInterceptorProviders
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }