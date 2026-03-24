/**
 * @copyright 2020-2021, FMR LLC
 * @file This file is responsible for testing the appComponent.
 * @author Joseph DePompeis (a1671766)
 */

import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LibraryComponent } from './library.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { AngularUtilsModule, FdAnalyticsService, FdWindowService } from '@fmr-ap123285/angular-utils';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { of, ReplaySubject, throwError } from 'rxjs';
import { chapterExample, overviewContent, tocListExample, tocListExampleJSON, errorData } from '../../app.component.data';
import { ChapterInterface } from '../../models/chapter.interface';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, Params } from '@angular/router';

class ActivatedRouteStub implements Partial<ActivatedRoute> {
    public subject = new ReplaySubject<ParamMap>();
    public paramMap = this.subject.asObservable();

    private _paramMap: ParamMap;
    constructor(initialParams?: Params) {
        this.setParamMap(initialParams);
    }

    get snapshot(): ActivatedRouteSnapshot {
        const snapshot: Partial<ActivatedRouteSnapshot> = {
            paramMap: this._paramMap
        };

        return snapshot as ActivatedRouteSnapshot;
    }

    setParamMap(params?: Params) {
        const paramMap = convertToParamMap(params);
        this._paramMap = paramMap;
        this.subject.next(paramMap);
    }
}

describe('LibraryComponent', () => {
    let component: LibraryComponent;
    let componentFixture: ComponentFixture<LibraryComponent>;
    let libraryService: LibraryService;
    let fdAnalyticsService: FdAnalyticsService;
    let routeStub: ActivatedRouteStub;
    let fdWindowService = new FdWindowService();

    const mockWindow = {
        config: {
            pageContextUser: 'plansponsor'
        }
    };


    const navigateByChapterId = (chapterId: string) => {
        routeStub.setParamMap({ chapterId });
    };

    beforeEach(waitForAsync(() => {
        routeStub = new ActivatedRouteStub();
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                AngularUtilsModule,
                HttpClientModule
            ],
            providers: [
                LibraryService,
                FdAnalyticsService,
                { provide: ActivatedRoute, useValue: routeStub }
            ],
            declarations: [
                LibraryComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents()
            .then(() => {
                componentFixture = TestBed.createComponent(LibraryComponent);
                component = componentFixture.componentInstance;
                libraryService = TestBed.inject(LibraryService);
                fdAnalyticsService = TestBed.inject(FdAnalyticsService);
                fdWindowService = TestBed.inject(FdWindowService);
            });
    }));

    afterEach(waitForAsync(() => {
        fdWindowService.getWindow().analyticsPageTitleName = null;
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(LibraryComponent);
        const appComponent = fixture.debugElement.componentInstance;
        expect(appComponent).toBeTruthy();
    });

    it('should create the component', waitForAsync(() => {
        expect(component).toBeTruthy();
    }));

    it('ngOnInit should make content call', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(overviewContent));
        jest.spyOn(component, 'chaptersAPI');

        component.ngOnInit();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveOverviewContent).toHaveBeenCalled();
            expect(component.overviewContent).toBeTruthy();
            expect(component.overviewContent).toBeTruthy();
        });
    }));

    it('ngOnInit should set tocListJson', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(overviewContent));
        jest.spyOn(component, 'transformTocListToString').mockImplementationOnce(()=>{});
        jest.spyOn(component, 'chaptersAPI');

        component.ngOnInit();
        componentFixture.whenStable().then(() => {
            expect(component.transformTocListToString).toHaveBeenCalled();
            expect(component.tocListJson).toBeUndefined();
        });
    }));

    it('ngOnInit should leave contentReady as false if response is null', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(null));
        expect(component.overviewContentLoading).toBeFalsy();
        component.ngOnInit();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveOverviewContent).toHaveBeenCalled();
            expect(component.overviewContent).not.toBeDefined();
        });
    }));

    it('ngOnInit should call setAnalyticsPageName', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(null));
        jest.spyOn(component, 'setAnalyticsPageName').mockImplementationOnce(()=>{});
        component.ngOnInit();
        expect(component.setAnalyticsPageName).toHaveBeenCalled();
    }));

    it('setAnalyticsPageName should set page name based on window analyticsPageTitleName', waitForAsync(() => {
        fdWindowService.getWindow().analyticsPageTitleName = 'Analytics Page Name Example';
        component.setAnalyticsPageName();
        expect(component.analyticsPageName).toBe('Analytics Page Name Example');
    }));

    it('setAnalyticsPageName should set page name to PSW Library if none is found in window', waitForAsync(() => {
        component.setAnalyticsPageName();
        expect(component.analyticsPageName).toBe('PSW Library');
    }));

    it('tocListToString should transform tocs to JSON string', waitForAsync(() => {
        jest.spyOn(component, 'chaptersAPI');
        component.transformTocListToString(tocListExample);
        expect(component.tocListJson).toBe(tocListExampleJSON);
    }));

    it('tocListToString should call chaptersAPI', waitForAsync(() => {
        jest.spyOn(component, 'chaptersAPI');
        component.transformTocListToString(tocListExample);
        expect(component.chaptersAPI).toHaveBeenCalled();
    }));

    it('tocListToString should set tocSelected to the chapterId from the route path', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(overviewContent));
        jest.spyOn(component, 'chaptersAPI');
        navigateByChapterId('toclistexampletitle1');
        componentFixture.detectChanges();
        component.transformTocListToString(tocListExample);
        expect(component.tocSelected).toBe('href/example1');
    }));

    it('chaptersAPI should make retrieveChaptersContent call', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveChaptersContent').mockReturnValue(of(chapterExample));
        component.chaptersAPI();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveChaptersContent).toHaveBeenCalled();
            expect(component.chapterContent.title).toBe('Welcome to the SPS quick reference guide');
            expect(component.chapterContentLoading).toBeFalsy();
        });
    }));

    it('chaptersAPI should not make retrieveChaptersContent call if chapterUrl is not defined', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveChaptersContent').mockReturnValue(of(chapterExample));
        component.tocSelected = null;
        component.chaptersAPI();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveChaptersContent).not.toHaveBeenCalled();
            expect(component.chapterContentLoading).toBeFalsy();
        });
    }));

    it('should test error conditionals retrieveOverviewContent', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(throwError(new HttpErrorResponse({ error: errorData })));
        component.ngOnInit();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveOverviewContent).toHaveBeenCalled();
            expect(component.errorResponse).toBeTruthy();
            expect(component.overviewContentLoading).toBeFalsy();
            expect(component.isInitialPageLoad).toBeFalsy();
        });
    }));

    it('should not set errorResponse data if errorResponse does not contain errors attribute while calling' +
        'retrieveOverviewContent', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(throwError(new HttpErrorResponse({ error: null })));
        component.ngOnInit();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveOverviewContent).toHaveBeenCalled();
            expect(component.errorResponse).toBeFalsy();
            expect(component.overviewContentLoading).toBeFalsy();
            expect(component.isInitialPageLoad).toBeFalsy();
        });
    }));

    it('should test error conditionals retrieveChaptersContent', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveChaptersContent').mockReturnValue(throwError(new HttpErrorResponse({ error: errorData })));
        component.chaptersAPI();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveChaptersContent).toHaveBeenCalled();
            expect(component.chapterErrorResponse).toBeTruthy();
            expect(component.errorResponse).toBeFalsy();
            expect(component.chapterContentLoading).toBeFalsy();
        });
    }));

    it('chaptersAPI should call analytics service', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveChaptersContent').mockReturnValue(of(chapterExample));
        jest.spyOn(fdAnalyticsService, 'submitAnalytics');
        component.analyticsPageName = 'Analytics Page Name';
        component.chaptersAPI();
        componentFixture.whenStable().then(() => {
            /* eslint-disable */
            const expectedResult = {
                page_name: 'Analytics Page Name' + ' | ' + chapterExample.title,
                site_events: { spa_page_view: true }
            };
            /* eslint-enable */
            expect(fdAnalyticsService.submitAnalytics).toHaveBeenCalledWith(expectedResult);
        });
    }));

    it('calling chaptersAPI with no window attribute and no chapter title should return proper page_name', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveChaptersContent').mockReturnValue(of({} as unknown as ChapterInterface));
        jest.spyOn(fdAnalyticsService, 'submitAnalytics');
        component.setAnalyticsPageName();
        component.chaptersAPI();
        componentFixture.whenStable().then(() => {
            /* eslint-disable */
            const expectedResult = {
                page_name: 'PSW Library' + ' | ' + 'no chapter title found',
                site_events: { spa_page_view: true }
            };
            /* eslint-enable */
            expect(fdAnalyticsService.submitAnalytics).toHaveBeenCalledWith(expectedResult);
        });
    }));
    it('ngOnInit should make content call', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(overviewContent));
        jest.spyOn(component, 'chaptersAPI');
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);

        component.ngOnInit();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveOverviewContent).toHaveBeenCalled();
            expect(component.overviewContent).toBeTruthy();
            expect(component.overviewContent).toBeTruthy();
            expect(component.overviewContentLoading).toBeFalsy();
            expect(component.isInitialPageLoad).toBeFalsy();
        });
    }));

    xit('ngOnInit should set tocListJson', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(overviewContent));
        jest.spyOn(component, 'transformTocListToString').mockImplementationOnce(()=>{});
        jest.spyOn(component, 'chaptersAPI');
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);

        component.ngOnInit();
        componentFixture.whenStable().then(() => {
            expect(component.transformTocListToString).toHaveBeenCalled();
            expect(component.tocListJson).toBeTruthy();
        });
    }));

    it('ngOnInit should leave contentReady as false if response is null', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(null));
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.ngOnInit();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveOverviewContent).toHaveBeenCalled();
            expect(component.overviewContent).not.toBeDefined();
        });
    }));

    it('ngOnInit should call setAnalyticsPageName', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(null));
        jest.spyOn(component, 'setAnalyticsPageName').mockImplementationOnce(()=>{});
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.ngOnInit();
        expect(component.setAnalyticsPageName).toHaveBeenCalled();
    }));

    it('setAnalyticsPageName should set page name based on window analyticsPageTitleName', waitForAsync(() => {
        fdWindowService.getWindow().analyticsPageTitleName = 'Analytics Page Name Example';
        component.setAnalyticsPageName();
        expect(component.analyticsPageName).toBe('Analytics Page Name Example');
    }));

    it('setAnalyticsPageName should set page name to PSW Library if none is found in window', waitForAsync(() => {
        component.setAnalyticsPageName();
        expect(component.analyticsPageName).toBe('PSW Library');
    }));

    it('tocListToString should transform tocs to JSON string', waitForAsync(() => {
        jest.spyOn(component, 'chaptersAPI');
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.transformTocListToString(tocListExample);
        expect(component.tocListJson).toBe(tocListExampleJSON);
    }));

    it('tocListToString should call chaptersAPI', waitForAsync(() => {
        jest.spyOn(component, 'chaptersAPI');
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.transformTocListToString(tocListExample);
        expect(component.chaptersAPI).toHaveBeenCalled();
    }));

    it('chaptersAPI should make retrieveChaptersContent call', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveChaptersContent').mockReturnValue(of(chapterExample));
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.chaptersAPI();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveChaptersContent).toHaveBeenCalled();
            expect(component.chapterContent.title).toBe('Welcome to the SPS quick reference guide');
        });
    }));

    it('should test error conditionals retrieveOverviewContent', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(throwError(new HttpErrorResponse({ error: errorData })));
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.ngOnInit();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveOverviewContent).toHaveBeenCalled();
            expect(component.errorResponse).toBeTruthy();
        });
    }));

    it('should test error conditionals retrieveChaptersContent', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveChaptersContent').mockReturnValue(throwError(new HttpErrorResponse({ error: errorData })));
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.chaptersAPI();
        componentFixture.whenStable().then(() => {
            expect(libraryService.retrieveChaptersContent).toHaveBeenCalled();
            expect(component.chapterErrorResponse).toBeTruthy();
            expect(component.errorResponse).toBeFalsy();
        });
    }));

    it('chaptersAPI should call analytics service', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveChaptersContent').mockReturnValue(of(chapterExample));
        jest.spyOn(fdAnalyticsService, 'submitAnalytics');
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.analyticsPageName = 'Analytics Page Name';
        component.chaptersAPI();
        componentFixture.whenStable().then(() => {
            /* eslint-disable */
            const expectedResult = {
                page_name: 'Analytics Page Name' + ' | ' + chapterExample.title,
                site_events: { spa_page_view: true }
            };
            /* eslint-enable */
            expect(fdAnalyticsService.submitAnalytics).toHaveBeenCalledWith(expectedResult);
        });
    }));

    it('calling chaptersAPI with no window attribute and no chapter title should return proper page_name', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveChaptersContent').mockReturnValue(of({} as unknown as ChapterInterface));
        jest.spyOn(fdAnalyticsService, 'submitAnalytics');
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        component.setAnalyticsPageName();
        component.chaptersAPI();
        componentFixture.whenStable().then(() => {
            /* eslint-disable */
            const expectedResult = {
                page_name: 'PSW Library' + ' | ' + 'no chapter title found',
                site_events: { spa_page_view: true }
            };
            /* eslint-enable */
            expect(fdAnalyticsService.submitAnalytics).toHaveBeenCalledWith(expectedResult);
        });
    }));

    it('should set pageContextUser if it is found.', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(overviewContent));
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue(mockWindow);
        expect(component).toBeDefined();
        component.ngOnInit();
        expect(component.pageContextUser).toEqual(mockWindow.config.pageContextUser);
    }));

    it('should use default value of pageContextUser if not found in window.', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(overviewContent));
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue({
            config: {}
        });
        expect(component).toBeDefined();
        component.ngOnInit();
        expect(component.pageContextUser).toEqual('plansponsor');
    }));

    it('should set spark context if pageContextUser in window is spark', waitForAsync(() => {
        jest.spyOn(libraryService, 'retrieveOverviewContent').mockReturnValue(of(overviewContent));
        jest.spyOn(fdWindowService, 'getWindow').mockReturnValue({
            config: { pageContextUser: 'spark' }
        });
        expect(component).toBeDefined();
        component.ngOnInit();
        expect(component.pageContextUser).toEqual('spark');
        expect(component.sparkNavbarContext).toBeDefined();
    }));
});
