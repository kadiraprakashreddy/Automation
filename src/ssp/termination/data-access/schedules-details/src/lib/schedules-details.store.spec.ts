import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';
import { mockSchedulesDetailsRestResponse } from './mocks';
import { SchedulesDetailsService } from './schedules-details.service';
import { SchedulesDetailsStore } from './schedules-details.store';
import { TerminationsRootStore } from '@fmr-ap160368/sps-termination-data-access-terminations-root';

describe('SchedulesDetailsStore', () => {
  let spectator: SpectatorService<InstanceType<typeof SchedulesDetailsStore>>;
  const mockGetRestData = jest.fn();

  const createService = createServiceFactory({
    service: SchedulesDetailsStore,
    providers: [
      {
        provide: SchedulesDetailsService,
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
    mockGetRestData.mockReturnValue(of(mockSchedulesDetailsRestResponse));
    expect(spectator.service).toBeTruthy();
  });

  it('should set hasData after getting the data', () => {
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(of(mockSchedulesDetailsRestResponse));
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should NOT initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(
      of({
        schedulesDetailsList: undefined,
      }),
    );
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(false);
  });

  it('should set error state when there is an error with REST data', () => {
    const serviceSpy = spectator.inject(SchedulesDetailsService);
    serviceSpy.getRestData.mockImplementationOnce(() => {
      return throwError(() => 'error');
    });
    spectator.service.getRestData();
    expect(spectator.service.loadingStatus()).toEqual({
      error: 'There was an error',
    });
  });
});
