import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
// REST Related Imports
import { HttpClient } from '@angular/common/http';

import { TerminationsRootRestResponse } from './terminations-root.model';

export const TERMINATIONS_ROOT_URL = '/api/terminations-root';

@Injectable({
  providedIn: 'root',
})
export class TerminationsRootService {
  readonly httpClient: HttpClient = inject(HttpClient);

  public getRestData(): Observable<TerminationsRootRestResponse> {
    return this.httpClient.get<TerminationsRootRestResponse>(
      TERMINATIONS_ROOT_URL,
    );
  }
}
