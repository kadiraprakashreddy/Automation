/**
 * @copyright 2020-2021, FMR LLC
 * @file This Library Service is responsible for making API calls
 * @author Preeti Chaurasia (a634796)
 */

import { Injectable } from '@angular/core';
import { FdHttpClientService, FdWindowService } from '@fmr-ap123285/angular-utils';
import { ChapterInterface } from '../models/chapter.interface';
import { Observable } from 'rxjs';

@Injectable()
export class LibraryService {

    /** Headers necessary for Exp API request. */
    private httpOptions = {
        excludeContentCheck: true,
        excludeDataCheck: true
    };

    /**
     * Creates an instance of FdHttpClientService.
     *
     * @param http use for making HTTP request calls.
     * @memberof FdHttpClientService
     */
    constructor(private fdHttpClientService: FdHttpClientService, private fdWindowService: FdWindowService) { }

    /** Makes a content request for overviewContent, allowing for ErrorMessage (or any
     * other) type error responses.
     */
    public retrieveOverviewContent() {
        if (this.fdWindowService.getWindow() && this.fdWindowService.getWindow().apis) {
            const apis = this.fdWindowService.getWindow().apis;
            if (this.fdWindowService.getWindow().apis.getBookApi) {
                return this.fdHttpClientService.getData(apis.getBookApi, this.httpOptions);
            }
        }
    }

    /**
     * Retrieves a particular chapters content based on the BookId associated with it.
     *
     * @param chaptersUrl endpoint for the Chapters api
     */
    public retrieveChaptersContent(chaptersUrl: string): Observable<ChapterInterface> {
        return this.fdHttpClientService.getData(chaptersUrl, this.httpOptions);
    }
}
