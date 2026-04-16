/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  FciHeaderStatusInterceptor,
  GlobalInterceptor,
} from '@fmr-ap123285/angular-utils';

const allHttpInterceptorProviders = [
  // adds 'Content-Type' : 'application/json' header to all
  // requests unless a content-type is already specified
  {
    provide: HTTP_INTERCEPTORS,
    useClass: GlobalInterceptor,
    multi: true,
  },
  // throws HttpErrorResponse if 'fid-ws-http-status' header
  // is present and is < 200 or > 299
  {
    provide: HTTP_INTERCEPTORS,
    useClass: FciHeaderStatusInterceptor,
    multi: true,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ...allHttpInterceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
