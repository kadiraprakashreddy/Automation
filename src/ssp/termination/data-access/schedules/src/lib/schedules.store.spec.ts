import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';
import { mockSchedulesRestResponse } from './mocks';
import { SchedulesService } from './schedules.service';
import { SchedulesStore } from './schedules.store';
import { TerminationsRootStore } from '@fmr-ap160368/sps-termination-data-access-terminations-root';

describe('SchedulesStore', () => {
  let spectator: SpectatorService<InstanceType<typeof SchedulesStore>>;
  const mockGetRestData = jest.fn();

  const createService = createServiceFactory({
    service: SchedulesStore,
    providers: [
      {
        provide: SchedulesService,
        useValue: {
          getRestData: mockGetRestData,
        },
      },
    ],
    mocks: [TerminationsRootStore],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create the service', () => {
    mockGetRestData.mockReturnValue(of(mockSchedulesRestResponse));
    expect(spectator.service).toBeTruthy();
  });

  it('should set hasData after getting the data', () => {
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(of(mockSchedulesRestResponse));
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should NOT initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(
      of({
        schedulesList: undefined,
      }),
    );
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(false);
  });

  it('should set error state when there is an error with REST data', () => {
    const serviceSpy = spectator.inject(SchedulesService);
    serviceSpy.getRestData.mockImplementationOnce(() => {
      return throwError(() => 'error');
    });
    spectator.service.getRestData();
    expect(spectator.service.loadingStatus()).toEqual({
      error: 'There was an error',
    });
  });
});
