import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { DEFAULT_GENERAL_INFO_FORM } from './constants/general-info.constants';
import { GeneralInfoStore } from './general-info.store';

describe('GeneralInfoStore', () => {
  let spectator: SpectatorService<InstanceType<typeof GeneralInfoStore>>;

  const createService = createServiceFactory({
    service: GeneralInfoStore,
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create the service', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should expose default derived state', () => {
    expect(spectator.service.currentLevel()).toBe('equity');
    expect(spectator.service.showsPlanField()).toBe(false);
    expect(spectator.service.showsProductField()).toBe(false);
  });

  it('should update form fields and reset form', () => {
    spectator.service.updateFormField('terminationEquityType', 'Cash(CSH)');
    spectator.service.updateFormField('terminationPlanId', 'ADPOP');

    expect(spectator.service.formState().terminationEquityType).toBe(
      'Cash(CSH)',
    );
    expect(spectator.service.formState().terminationPlanId).toBe('ADPOP');

    spectator.service.resetForm();

    expect(spectator.service.formState()).toEqual(DEFAULT_GENERAL_INFO_FORM);
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
});
