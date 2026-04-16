import { SpectatorService, createHttpFactory } from '@ngneat/spectator/jest';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { SchedulesService } from './schedules.service';
import {} from './schedules.model';

import { dataMock } from './mocks';

describe('SchedulesService', () => {
  let spectator: SpectatorService<SchedulesService>;

  const createService = createHttpFactory({
    service: SchedulesService,

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
