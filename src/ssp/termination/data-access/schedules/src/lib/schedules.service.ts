import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
// REST Related Imports
import { HttpClient } from '@angular/common/http';

import { SchedulesRestResponse } from './schedules.model';

export const SCHEDULES_URL = '/api/schedules';

@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
  readonly httpClient: HttpClient = inject(HttpClient);

  public getRestData(): Observable<SchedulesRestResponse> {
    return this.httpClient.get<SchedulesRestResponse>(SCHEDULES_URL);
  }
}
