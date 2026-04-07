/**
 * @copyright 2020, FMR LLC
 * @file This file is responsible for testing the ParagraphComponent.
 * @author Joseph DePompeis (a1671766)
 */

import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularUtilsModule, FdWindowService } from '@fmr-ap123285/angular-utils';
import { HttpClientModule } from '@angular/common/http';
import { ParagraphComponent } from './paragraph.component';
import { ChapterInterface } from '../../models/chapter.interface';

export const chapterExample: ChapterInterface = {
    title: 'Welcome to the SPS quick reference guide',
    articles: [
        {
            articleHeading: null,
            articleSubHeading: null,
            paragraphs: [
                {
                    type: 'STRING',
                    value: 'Your source to understanding and using Stock Plan Services. Heres what youll find inside:'
                },
                {
                    type: 'STRING',
                    value: '<ul xmlns=\http://www.w3.org/1999/xhtml\npm><li>Basics on equity '+
                    'compensation types</li><li>Timelines for actions '
                    +'you need to take</li><li>Tools to simplify your workflow</li></ul>'
                },
                {
                    type: 'STRING',
                    value: 'Choose a chapter to get started.'
                }
            ],
            subArticles: null
        }
    ],
    footnotes: 'testing footnotes'
};

const mockWindow = {
    brightcoveConfig: { scripts:['https:\/\/players.brightcove.net\/5781043325001\/tU9P6t2Kt_default\/index.min.js'] }
};

describe('ParagraphComponent', () => {
    let component: ParagraphComponent;
    let componentFixture: ComponentFixture<ParagraphComponent>;
    let fdWindowService = new FdWindowService();

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                AngularUtilsModule,
                HttpClientModule
            ],
            providers: [],
            declarations: [
                ParagraphComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents()
            .then(() => {
                componentFixture = TestBed.createComponent(ParagraphComponent);
                component = componentFixture.componentInstance;
                fdWindowService = TestBed.inject(FdWindowService);
            });
    }));

    it('should create the component', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('ngOnChanges should set articles', waitForAsync(() => {
        component.chapterContent = chapterExample;
        component.ngOnChanges();
        expect(component.articles).toBe(chapterExample.articles);
    }));

    it('ngOnInit should set playerConfiguration', waitForAsync(() => {
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.ngOnInit();
        expect(component.playerConfiguration).toBeDefined();
    }));

    it('ngOnInit should not throw error if brightcoveConfig is empty', waitForAsync(() => {
        const emptyWindow = {};
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(emptyWindow);
        component.ngOnInit();
        expect(component.playerConfiguration.accountId).toBeUndefined();
        expect(component.playerConfiguration.playerId).toBeUndefined();
        expect(component.playerConfiguration.videoScriptUrls).toBeUndefined();
    }));
});
