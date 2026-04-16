import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';
import { mockSchedulesCopyRestResponse } from './mocks';
import { SchedulesCopyService } from './schedules-copy.service';
import { SchedulesCopyStore } from './schedules-copy.store';
import { TerminationsRootStore } from '@fmr-ap160368/sps-termination-data-access-terminations-root';

describe('SchedulesCopyStore', () => {
  let spectator: SpectatorService<InstanceType<typeof SchedulesCopyStore>>;
  const mockGetRestData = jest.fn();

  const createService = createServiceFactory({
    service: SchedulesCopyStore,
    providers: [
      {
        provide: SchedulesCopyService,
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
    mockGetRestData.mockReturnValue(of(mockSchedulesCopyRestResponse));
    expect(spectator.service).toBeTruthy();
  });

  it('should set hasData after getting the data', () => {
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(of(mockSchedulesCopyRestResponse));
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(true);
  });

  it('should NOT initialize with default state with REST data', () => {
    mockGetRestData.mockReturnValue(
      of({
        schedulesCopyList: undefined,
      }),
    );
    spectator.service.getRestData();
    expect(spectator.service.hasData()).toBe(false);
  });

  it('should set error state when there is an error with REST data', () => {
    const serviceSpy = spectator.inject(SchedulesCopyService);
    serviceSpy.getRestData.mockImplementationOnce(() => {
      return throwError(() => 'error');
    });
    spectator.service.getRestData();
    expect(spectator.service.loadingStatus()).toEqual({
      error: 'There was an error',
    });
  });
});
