import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';
import { mockSchedulesCreateRestResponse } from './mocks';
import { SchedulesCreateService } from './schedules-create.service';
import { SchedulesCreateStore } from './schedules-create.store';
import { TerminationsRootStore } from '@fmr-ap160368/sps-termination-data-access-terminations-root';

describe('SchedulesCreateStore', () => {
  let spectator: SpectatorService<InstanceType<typeof SchedulesCreateStore>>;
  const mockGetRestData = jest.fn();

  const createService = createServiceFactory({
    service: SchedulesCreateStore,
    providers: [
      {
        provide: SchedulesCreateService,
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
    mockGetRestData.mockReturnValue(of(mockSchedulesCreateRestResponse));
    expect(spectator.service).toBeTruthy();
  });

  it('should set hasData after getting the data', () => {
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(of(mockSchedulesCreateRestResponse));
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should NOT initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(
      of({
        schedulesCreateList: undefined,
      }),
    );
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(false);
  });

  it('should set error state when there is an error with REST data', () => {
    const serviceSpy = spectator.inject(SchedulesCreateService);
    serviceSpy.getRestData.mockImplementationOnce(() => {
      return throwError(() => 'error');
    });
    spectator.service.getRestData();
    expect(spectator.service.loadingStatus()).toEqual({
      error: 'There was an error',
    });
  });
});
