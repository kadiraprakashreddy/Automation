import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
// REST Related Imports
import { HttpClient } from '@angular/common/http';

import { SchedulesDetailsRestResponse } from './schedules-details.model';

export const SCHEDULES_DETAILS_URL = '/api/schedules-details';

@Injectable({
  providedIn: 'root',
})
export class SchedulesDetailsService {
  readonly httpClient: HttpClient = inject(HttpClient);

  public getRestData(): Observable<SchedulesDetailsRestResponse> {
    return this.httpClient.get<SchedulesDetailsRestResponse>(
      SCHEDULES_DETAILS_URL,
    );
  }
}
