import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';
import { mockTerminationsRootRestResponse } from './mocks';
import { TerminationsRootService } from './terminations-root.service';
import { TerminationsRootStore } from './terminations-root.store';

describe('TerminationsRootStore', () => {
  let spectator: SpectatorService<InstanceType<typeof TerminationsRootStore>>;
  const mockGetRestData = jest.fn();

  const createService = createServiceFactory({
    service: TerminationsRootStore,
    providers: [
      {
        provide: TerminationsRootService,
        useValue: {
          getRestData: mockGetRestData,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create the service', () => {
    mockGetRestData.mockReturnValue(of(mockTerminationsRootRestResponse));
    expect(spectator.service).toBeTruthy();
  });

  it('should set hasData after getting the data', () => {
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(of(mockTerminationsRootRestResponse));
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should NOT initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(
      of({
        terminationsRootList: undefined,
      }),
    );
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(false);
  });

  it('should set error state when there is an error with REST data', () => {
    const serviceSpy = spectator.inject(TerminationsRootService);
    serviceSpy.getRestData.mockImplementationOnce(() => {
      return throwError(() => 'error');
    });
    spectator.service.getRestData();
    expect(spectator.service.loadingStatus()).toEqual({
      error: 'There was an error',
    });
  });
});
