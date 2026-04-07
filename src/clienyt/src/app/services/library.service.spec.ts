/**
 * @copyright 2020-2021, FMR LLC
 * @file This file is responsible for testing the library service.
 * @author Joseph DePompeis (a1671766)
 */

import { TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FdHttpClientService, FdWindowService } from '@fmr-ap123285/angular-utils';
import { Observable } from 'rxjs';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { LibraryService } from './library.service';
import { OverviewContentInterface } from '../models/overviewContent.interface';
import { ChapterInterface } from '../models/chapter.interface';

let fdHttpClientService: FdHttpClientService;
let libraryService: LibraryService;
let fdWindowService = new FdWindowService();

const mockWindow = {
    config: {
        pageContextUser: 'plansponsor'
    },
    apis: {
        getBookApi: 'getBookApi/example'
    }
};

describe('Library Service', () => {

    beforeEach(waitForAsync(() => {
        TestBed.resetTestEnvironment();
        TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                FdHttpClientService,
                LibraryService
            ]
        });

        TestBed.compileComponents().then(() => {
            libraryService = TestBed.inject(LibraryService);
            fdHttpClientService = TestBed.inject(FdHttpClientService);
            fdWindowService = TestBed.inject(FdWindowService);
        });
    }));

    it('should test the happy path for retrieveOverviewContent call', waitForAsync(() => {
        const response = {
            title: 'SPS Quick Reference Guide',
            description: 'Descriptive text about the page',
            tocLabel: 'Table of Contents',
            goLabel: 'Go',
            toc: {},
            footnotes: '<p>some html here</p>'
        };

        jest.spyOn(fdHttpClientService, 'getData').mockReturnValue(response as unknown as Observable<OverviewContentInterface>);
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        const result = libraryService.retrieveOverviewContent() as unknown as OverviewContentInterface;
        expect(result.title).toBe('SPS Quick Reference Guide');
        expect(result.goLabel).toBe('Go');
    }));

    it('should not call fdHttpClientService if getBookApi is not found on window', waitForAsync(() => {
        jest.spyOn(fdHttpClientService, 'getData');
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue({
            config: {
                pageContextUser: ''
            },
            apis: null
        });
        libraryService.retrieveOverviewContent();
        expect(fdHttpClientService.getData).not.toHaveBeenCalled();
    }));

    it('should test the happy path for retrieveChaptersContent when articleSubHeading is null', waitForAsync(() => {
        const chapterExample: ChapterInterface = {
            title: 'Welcome to the SPS quick reference guide',
            articles: [
                {
                    articleHeading: null,
                    articleSubHeading: null,
                    paragraphs: [
                        {
                            type: 'STRING',
                            value: 'Your source to understanding and using Stock Plan Services.'
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
        jest.spyOn(fdHttpClientService, 'getData').mockReturnValue(chapterExample as unknown as Observable<ChapterInterface>);
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        const result = libraryService.retrieveChaptersContent('chaptersUrl')as unknown as ChapterInterface;
        expect(result).toBe(chapterExample);
    }));

    it('should test the happy path for retrieveChaptersContent when articleSubHeading is not null', waitForAsync(() => {
        const chapterExample: ChapterInterface = {
            title: 'Welcome to the SPS quick reference guide',
            articles: [
                {
                    articleHeading: null,
                    articleSubHeading: 'Introduce your participants',
                    paragraphs: [
                        {
                            type: 'STRING',
                            value: 'Your source to understanding and using Stock Plan Services.'
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
        jest.spyOn(fdHttpClientService, 'getData').mockReturnValue(chapterExample as unknown as Observable<ChapterInterface>);
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        const result = libraryService.retrieveChaptersContent('chaptersUrl')as unknown as ChapterInterface;
        expect(result).toBe(chapterExample);
    }));
});
