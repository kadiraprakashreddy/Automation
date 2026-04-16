import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { of, throwError } from 'rxjs';
import { mockSchedulesCreateRestResponse } from './mocks';
import { SchedulesCreateService } from './schedules-create.service';
import { SchedulesCreateStore } from './schedules-create.store';
import { TerminationsRootStore } from '@fmr-ap160368/sps-termination-data-access-terminations-root';
import { DEFAULT_SCHEDULE_CREATE_FORM } from './schedules-create.constants';

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
    mockGetRestData.mockReset();
    mockGetRestData.mockReturnValue(of(mockSchedulesCreateRestResponse));
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

  it('should call getRestData on init', () => {
    expect(mockGetRestData).toHaveBeenCalled();
  });

  it('should expose configured derived state and root data', () => {
    expect(spectator.service.currentLevel()).toBe('equity');
    expect(spectator.service.showsPlanField()).toBe(false);
    expect(spectator.service.showsProductField()).toBe(false);
    expect(spectator.service.rootData).toBeDefined();
  });

  it('should update form fields and reset form', () => {
    spectator.service.updateFormField('terminationEquityType', 'Cash(CSH)');
    spectator.service.updateFormField('terminationPlanId', 'ADPOP');

    expect(spectator.service.formState().terminationEquityType).toBe(
      'Cash(CSH)',
    );
    expect(spectator.service.formState().terminationPlanId).toBe('ADPOP');

    spectator.service.resetForm();

    expect(spectator.service.formState()).toEqual(DEFAULT_SCHEDULE_CREATE_FORM);
  });

  it('should reset dependent fields when switching to equity level', () => {
    spectator.service.updateFormField('terminationPlanId', 'ADPOP');
    spectator.service.updateFormField('terminationProductId', 'ESOP08FY15');

    spectator.service.onLevelChange('equity');

    expect(spectator.service.formState().level).toBe('equity');
    expect(spectator.service.formState().terminationPlanId).toBe('');
    expect(spectator.service.formState().terminationProductId).toBe('');
  });

  it('should reset product field when switching to plan level', () => {
    spectator.service.updateFormField('terminationPlanId', 'ADPOP');
    spectator.service.updateFormField('terminationProductId', 'ESOP08FY15');

    spectator.service.onLevelChange('plan');

    expect(spectator.service.formState().level).toBe('plan');
    expect(spectator.service.formState().terminationPlanId).toBe('ADPOP');
    expect(spectator.service.formState().terminationProductId).toBe('');
  });

  it('should preserve plan and product when staying on product level', () => {
    spectator.service.updateFormField('terminationPlanId', 'ADPOP');
    spectator.service.updateFormField('terminationProductId', 'ESOP08FY15');

    spectator.service.onLevelChange('product');

    expect(spectator.service.formState().level).toBe('product');
    expect(spectator.service.formState().terminationPlanId).toBe('ADPOP');
    expect(spectator.service.formState().terminationProductId).toBe(
      'ESOP08FY15',
    );
  });

  it('should clear product on plan-id blur when product field is hidden', () => {
    spectator.service.updateFormField('terminationProductId', 'ESOP08FY15');
    spectator.service.onLevelChange('plan');

    spectator.service.onPlanIdChange();

    expect(spectator.service.formState().terminationProductId).toBe('');
  });

  it('should preserve product value on plan-id blur in product level', () => {
    spectator.service.onLevelChange('product');
    spectator.service.updateFormField('terminationPlanId', 'ADPOP');
    spectator.service.updateFormField('terminationProductId', 'NOT_VALID');

    spectator.service.onPlanIdChange();

    expect(spectator.service.formState().terminationProductId).toBe(
      'NOT_VALID',
    );
  });

  it('should preserve existing valid product on plan-id blur in product level', () => {
    spectator.service.onLevelChange('product');
    spectator.service.updateFormField('terminationPlanId', 'ADPOP');
    spectator.service.updateFormField('terminationProductId', 'ESOP08FY15');

    spectator.service.onPlanIdChange();

    expect(spectator.service.formState().terminationProductId).toBe(
      'ESOP08FY15',
    );
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
