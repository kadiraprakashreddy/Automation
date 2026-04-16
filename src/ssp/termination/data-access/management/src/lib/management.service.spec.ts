import { SpectatorService, createHttpFactory } from '@ngneat/spectator/jest';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { ManagementService } from './management.service';
import {} from './management.model';

import { dataMock } from './mocks';

describe('ManagementService', () => {
  let spectator: SpectatorService<ManagementService>;

  const createService = createHttpFactory({
    service: ManagementService,

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
