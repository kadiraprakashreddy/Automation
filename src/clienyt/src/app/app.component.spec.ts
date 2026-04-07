/**
 * @copyright 2020-2021, FMR LLC
 * @file This file is responsible for testing the appComponent.
 * @author Joseph DePompeis (a1671766)
 */

import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LibraryService } from './services/library.service';
import { FdAnalyticsService } from '@fmr-ap123285/angular-utils';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
    let component: AppComponent;
    let componentFixture: ComponentFixture<AppComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.overrideComponent(AppComponent, {
            set: {
                template: '',
                imports: []
            }
        });
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientModule,
                AppComponent
            ],
            providers: [LibraryService, FdAnalyticsService],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents()
            .then(() => {
                componentFixture = TestBed.createComponent(AppComponent);
                component = componentFixture.componentInstance;
            });
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const appComponent = fixture.debugElement.componentInstance;
        expect(appComponent).toBeTruthy();
    });

    it('should create the component', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));
});
