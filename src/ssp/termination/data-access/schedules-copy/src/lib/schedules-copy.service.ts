import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
// REST Related Imports
import { HttpClient } from '@angular/common/http';

import { SchedulesCopyRestResponse } from './schedules-copy.model';

export const SCHEDULES_COPY_URL = '/api/schedules-copy';

@Injectable({
  providedIn: 'root',
})
export class SchedulesCopyService {
  readonly httpClient: HttpClient = inject(HttpClient);

  public getRestData(): Observable<SchedulesCopyRestResponse> {
    return this.httpClient.get<SchedulesCopyRestResponse>(SCHEDULES_COPY_URL);
  }
}
