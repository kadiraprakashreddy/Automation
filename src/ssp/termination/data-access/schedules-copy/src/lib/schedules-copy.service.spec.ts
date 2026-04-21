import { SpectatorService, createHttpFactory } from '@ngneat/spectator/jest';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { SchedulesCopyService } from './schedules-copy.service';
import {} from './schedules-copy.model';

import { dataMock } from './mocks';

describe('SchedulesCopyService', () => {
  let spectator: SpectatorService<SchedulesCopyService>;

  const createService = createHttpFactory({
    service: SchedulesCopyService,

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
