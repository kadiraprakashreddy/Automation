import { SpectatorService, createHttpFactory } from '@ngneat/spectator/jest';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { TerminationsRootService } from './terminations-root.service';
import {} from './terminations-root.model';

import { dataMock } from './mocks';

describe('TerminationsRootService', () => {
  let spectator: SpectatorService<TerminationsRootService>;

  const createService = createHttpFactory({
    service: TerminationsRootService,

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
