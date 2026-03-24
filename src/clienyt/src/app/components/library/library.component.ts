import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { OverviewContentInterface } from '../../models/overviewContent.interface';
import { TocInterface } from '../../models/toc.interface';
import { ChapterInterface } from '../../models/chapter.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { FAILURE_MSG, FAILURE_MSG_TITLE } from '../../constants/library.constants';
import { FdAnalyticsService, FdWindowService } from '@fmr-ap123285/angular-utils';
import { ActivatedRoute } from '@angular/router';
import { NavbarContext } from '@fmr-ap137030/spark-navbar';
/**
 * @copyright 2020-2022, FMR LLC
 * @file Parent component for Help and Learning
 * @author Preeti Chaurasia (a634796)
 */

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss'],
    standalone: false
})
export class LibraryComponent implements OnInit {

    /** Stores Page Content */
    public overviewContent: OverviewContentInterface;

    /** Stores Chapter Content */
    public chapterContent: ChapterInterface;

    /** Boolean to show if bookapi has been provided by api */
    public bookApiReady: boolean = false;

    /** Boolean to show if chaptercall is completed */
    public chapterCallComplete: boolean = false;

    /** JSON string of values that are used to populate select */
    public tocListJson: string;

    /** selected TOC */
    public tocSelected: string;

    /** Page name to be used for analytics call */
    public analyticsPageName: string;

    /** String for the Page level error message if the api fails */
    public errorMessage: string;

    /** String for the chapter level error message if the api fails */
    public chapterErrorMessage: string;

    /** Boolean to check whether their is an error response */
    public errorResponse: boolean = false;

    /** String for the error title */
    public errorTitle: string;

    /** Boolean to check whether their is an chapter error response */
    public chapterErrorResponse: boolean = false;

    /** Indicates which user is viewing this page (eg: plansponsor or spark). Default to 'plansponsor' */
    public pageContextUser: string;

    /** SparkNavBarContext */
    public sparkNavbarContext: NavbarContext;

    /** Flag to determine if overview content call is in progress */
    public overviewContentLoading: boolean = false;

    /** Flag to determine if this is the initial page load */
    public isInitialPageLoad: boolean = false;

    /** Flag to tell if chapter content call is in progress */
    public chapterContentLoading: boolean = false;

    /** Constant for the chapterId path param */
    readonly chapterId = 'chapterId';

    /** Constant for the plansponsor */
    readonly plansponsor = 'plansponsor';

    /** Constant for the spark */
    readonly spark = 'spark';

    /** constructor */
    constructor(private libraryService: LibraryService, private fdAnalyticsService: FdAnalyticsService,
        private route: ActivatedRoute, private fdWindowService: FdWindowService) { }

    /**
     * Initializes the rest of the application components after the application component is created.
     *
     *  @memberof LibraryComponent
     */
    public ngOnInit() {
        const windowObj = this.fdWindowService.getWindow();
        const windowConfig = windowObj?.config;
        this.pageContextUser = windowConfig?.pageContextUser || this.plansponsor;

        if (this.pageContextUser === this.spark) {
            this.sparkNavbarContext =
                new NavbarContext(windowConfig?.spsClientId, windowConfig?.sparkHostName,
                    windowConfig?.userId, windowConfig?.pageContext, windowObj?.txntoken);
        }
        this.setAnalyticsPageName();
        this.isInitialPageLoad = true;
        this.overviewContentLoading = true;
        this.libraryService.retrieveOverviewContent().subscribe(
            (response: OverviewContentInterface) => {
                if (response) {
                    this.overviewContent = response;
                    this.bookApiReady = true;
                    this.transformTocListToString(response.toc);
                    this.overviewContentLoading = false;
                }
            },
            (errorResponse: HttpErrorResponse) => {
                if (errorResponse instanceof HttpErrorResponse && errorResponse.error
                    && errorResponse.error.errors && errorResponse.error.errors[0]) {
                    this.errorResponse = true;
                    this.errorTitle = FAILURE_MSG_TITLE;
                    this.errorMessage = FAILURE_MSG + ' ' + errorResponse.error.errors[0].title;
                }
                this.overviewContentLoading = false;
                this.isInitialPageLoad = false;
            }
        );
    }

    /**
     * Gives component access to the window.
     * Sets analyticsPageName, which is used for analytics call
     */
    public setAnalyticsPageName() {
        const localWindow = this.fdWindowService.getWindow();
        this.analyticsPageName = localWindow.analyticsPageTitleName ? localWindow.analyticsPageTitleName : 'PSW Library';
    }

    /**
     * Transforms toc array into a string formatted for <pvd-select>
     * the select uses each toc as an item in the dropdown
     *
     * @param tocList : array of toc
     */
    public transformTocListToString(tocList: TocInterface[]): void {
        const pvdSelectFormattedTocList = [];
        const paramChapter = this.route.snapshot.paramMap.get(this.chapterId);
        let paramChapterValue = '';
        tocList.forEach((currentToc) => {
            if (paramChapter && currentToc.title.toLowerCase().replace(/ /g, '') === paramChapter.toLowerCase()) {
                paramChapterValue = currentToc.href;
            }
            pvdSelectFormattedTocList.push({
                value: currentToc.href,
                text: currentToc.title
            });
        });
        this.tocSelected = paramChapterValue !== '' ? paramChapterValue : pvdSelectFormattedTocList[0].value;
        this.chaptersAPI();
        this.tocListJson = JSON.stringify(pvdSelectFormattedTocList);
    }

    /**
     * Makes Chapters API call.
     * Calls analytics if chapter content is found.
     *
     *  @memberof LibraryComponent
     */
    public chaptersAPI() {
        const chapterUrl = this.tocSelected;
        if (chapterUrl !== null) {
            this.chapterContent = null;
            this.chapterContentLoading = true;
            this.libraryService.retrieveChaptersContent(chapterUrl)
                .subscribe(
                    (resp: ChapterInterface) => {
                        this.chapterContent = resp;
                        this.chapterCallComplete = true;
                        this.chapterErrorResponse = false;
                        this.callAnalytics(this.chapterContent);
                        this.chapterContentLoading = false;
                        this.isInitialPageLoad = false;
                    },
                    (chapterErrorResponse: HttpErrorResponse) => {
                        if (chapterErrorResponse instanceof HttpErrorResponse && chapterErrorResponse.error
                            && chapterErrorResponse.error.errors && chapterErrorResponse.error.errors[0]) {
                            this.chapterErrorResponse = true;
                            this.errorResponse = false;
                            this.chapterCallComplete = true;
                            this.errorTitle = FAILURE_MSG_TITLE;
                            this.chapterErrorMessage = FAILURE_MSG + ' ' + chapterErrorResponse.error.errors[0].title;
                        }
                        this.chapterContentLoading = false;
                        this.isInitialPageLoad = false;
                    }
                );
        }
    }

    /**
     * Calls analytics service
     *
     * @param chapterContent: used for providing chapter title
     */
    public callAnalytics(chapterContent: ChapterInterface) {
        const chapterTitle = chapterContent.title ? chapterContent.title : 'no chapter title found';
        this.fdAnalyticsService.submitAnalytics({
            /* eslint-disable */
            page_name: this.analyticsPageName + ' | ' + chapterTitle,
            site_events: { spa_page_view: true }
            /* eslint-enable */
        });
    }
}
