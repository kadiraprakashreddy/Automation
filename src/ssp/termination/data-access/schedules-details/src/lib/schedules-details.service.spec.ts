import { SpectatorService, createHttpFactory } from '@ngneat/spectator/jest';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { SchedulesDetailsService } from './schedules-details.service';
import {} from './schedules-details.model';

import { dataMock } from './mocks';

describe('SchedulesDetailsService', () => {
  let spectator: SpectatorService<SchedulesDetailsService>;

  const createService = createHttpFactory({
    service: SchedulesDetailsService,

    mocks: [HttpClient],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create the service', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should getRestData', (done) => {
    const http = spectator.inject(HttpClient);
    http.get.mockReturnValueOnce(of(dataMock));

    spectator.service.getRestData().subscribe((result) => {
      expect(result).toEqual(dataMock);
      done();
    });
  });
});
