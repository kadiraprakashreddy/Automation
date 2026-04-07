/**
 * @copyright 2020, FMR LLC
 * @file This file is responsible for testing the chapterComponent.
 * @author Joseph DePompeis (a1671766)
 */

import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChapterComponent } from './chapter.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { HttpClientModule } from '@angular/common/http';

describe('ChapterComponent', () => {
    let component: ChapterComponent;
    let componentFixture: ComponentFixture<ChapterComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.overrideComponent(ChapterComponent, {
            set: {
                template: '',
                imports: []
            }
        });
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientModule,
                ChapterComponent
            ],
            providers: [LibraryService],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents()
            .then(() => {
                componentFixture = TestBed.createComponent(ChapterComponent);
                component = componentFixture.componentInstance;
            });
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(ChapterComponent);
        const chapterComponent = fixture.debugElement.componentInstance;
        expect(chapterComponent).toBeTruthy();
    });

    it('should create the component', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));
});
