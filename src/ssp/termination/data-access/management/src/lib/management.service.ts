import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
// REST Related Imports
import { HttpClient } from '@angular/common/http';

import { ManagementRestResponse } from './management.model';

export const MANAGEMENT_URL = '/api/management';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  readonly httpClient: HttpClient = inject(HttpClient);

  public getRestData(): Observable<ManagementRestResponse> {
    return this.httpClient.get<ManagementRestResponse>(MANAGEMENT_URL);
  }
}
