import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
// REST Related Imports
import { HttpClient } from '@angular/common/http';

import { SchedulesCreateRestResponse } from './schedules-create.model';

export const SCHEDULES_CREATE_URL = '/api/schedules-create';

@Injectable({
  providedIn: 'root',
})
export class SchedulesCreateService {
  readonly httpClient: HttpClient = inject(HttpClient);

  public getRestData(): Observable<SchedulesCreateRestResponse> {
    return this.httpClient.get<SchedulesCreateRestResponse>(
      SCHEDULES_CREATE_URL,
    );
  }
}
