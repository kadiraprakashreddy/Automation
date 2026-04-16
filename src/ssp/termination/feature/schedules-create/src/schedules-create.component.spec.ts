import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { SchedulesCreateStore } from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import { TooltipComponent } from '@fmr-ap167419/shared-design-system-ui-core';

import { SchedulesCreateComponent } from './schedules-create.component';

const EXPECTED_AUTOCOMPLETE_ITEMS = [
  { value: 'Test 1', label: 'Test 1' },
  { value: 'Test 2', label: 'Test 2' },
  { value: 'Test 3', label: 'Test 3' },
  { value: 'Test 4', label: 'Test 4' },
];

describe('SchedulesCreateComponent', () => {
  let spectator: Spectator<SchedulesCreateComponent>;

  const mockStore = {
    pageContent: jest.fn(() => ({
      terminationCardHeader: 'Create a termination rule',
      terminationCardTitle: 'Step 1: Termination rule level',
      terminationCardDescription:
        'Choose how broadly the term rules should be applied.',
      terminationCardRequiredFieldsMessage: 'All fields are required.',
      equityAwardLabel: 'Equity award',
      equityAwardTooltipText:
        'Rules at this level apply broadly to an equity type; for example, to all restricted stock award (RSA) plans and products.',
      equityAwardSelectOneLabel: 'Choose an award',
      planIdLabel: 'Plan ID',
      planIdTooltipText:
        'Rules apply more narrowly to a specific plan or plans.',
      productIdLabel: 'Product ID',
      productIdTooltipText:
        'The most granular level. Rules apply to specific products.',
      terminationRuleIdLabel: 'Termination rule ID',
      terminationRuleIdTooltipText:
        'A rule ID is a brief code of up to 10 letters or numbers that defines the underlying termination rule. Examples: VOL, INV, RET, DIS.',
      terminationRuleNameLabel: 'Termination rule name',
      terminationSaveAndExitLabel: 'Save and exit',
      terminationSaveAndContinueLabel: 'Save and continue',
      terminationCancelLabel: 'Cancel',
    })),
    levelOptions: jest.fn(() => [
      {
        value: 'equity',
        title: 'Equity award level',
        description: 'Apply rules at equity award level.',
      },
      {
        value: 'plan',
        title: 'Plan level',
        description: 'Apply rules at plan level.',
      },
      {
        value: 'product',
        title: 'Product level',
        description: 'Apply rules at product level.',
      },
    ]),
    equityAwardOptions: jest.fn(() => [
      'Cash(CSH)',
      'Restricted Stock Awards(RSA)',
      'Restricted Stock Units(RSU)',
    ]),
    currentLevel: jest.fn(() => 'equity'),
    showsPlanField: jest.fn(() => false),
    showsProductField: jest.fn(() => false),
    onLevelChange: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: SchedulesCreateComponent,
    providers: [
      {
        provide: SchedulesCreateStore,
        useValue: mockStore,
      },
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.currentLevel.mockReturnValue('equity');
    mockStore.showsPlanField.mockReturnValue(false);
    mockStore.showsProductField.mockReturnValue(false);
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render page title and step title', () => {
    expect(spectator.query('wi-ds-title h1')).toHaveText(
      'Create a termination rule',
    );
    expect(
      spectator.query('.termination-card__header wi-ds-title h2'),
    ).toHaveText('Step 1: Termination rule level');
  });

  it('should render outer and inner tile borders', () => {
    expect(spectator.queryAll('wi-ds-tile-base-content-block')).toHaveLength(2);
  });

  it('should render radio group options without a help trigger', () => {
    expect(spectator.query('.termination-card__help-trigger')).not.toExist();
    expect(spectator.query('wi-ds-radio-group')).toExist();
    expect(spectator.queryAll('wi-ds-radio')).toHaveLength(3);
  });

  it('should render required copy and default fields', () => {
    expect(spectator.query('.termination-card__required-copy')).toHaveText(
      'All fields are required.',
    );
    expect(spectator.query('wi-ds-select')).toExist();
    expect(spectator.queryAll('wi-ds-input')).toHaveLength(2);
    expect(spectator.queryAll(TooltipComponent)).toHaveLength(2);
  });

  it('should render form actions with three buttons', () => {
    expect(spectator.query('wi-ds-form-actions')).toExist();
    expect(spectator.queryAll('wi-ds-form-actions wi-ds-button')).toHaveLength(
      3,
    );
    expect(spectator.query('[pvd-id="save-and-continue-button"]')).toHaveText(
      'Save and continue',
    );
  });

  it('should render plan and product as autocomplete fields for product level', () => {
    mockStore.showsPlanField.mockReturnValue(true);
    mockStore.showsProductField.mockReturnValue(true);

    spectator = createComponent();

    expect(spectator.queryAll('wi-ds-autocomplete')).toHaveLength(2);
    expect(spectator.queryAll(TooltipComponent)).toHaveLength(4);
    expect(
      spectator.query('wi-ds-autocomplete[id="terminationPlanId"]'),
    ).toExist();
    expect(
      spectator.query('wi-ds-autocomplete[id="terminationProductId"]'),
    ).toExist();
  });

  it('should bind the visible tooltip copy from page content', () => {
    const tooltipText = spectator
      .queryAll(TooltipComponent)
      .map((tooltip) => tooltip.text());

    expect(tooltipText).toEqual([
      'Rules at this level apply broadly to an equity type; for example, to all restricted stock award (RSA) plans and products.',
      'A rule ID is a brief code of up to 10 letters or numbers that defines the underlying termination rule. Examples: VOL, INV, RET, DIS.',
    ]);
  });

  it('should render plan and product tooltip copy when those fields are visible', () => {
    mockStore.showsPlanField.mockReturnValue(true);
    mockStore.showsProductField.mockReturnValue(true);

    spectator = createComponent();

    const tooltipText = spectator
      .queryAll(TooltipComponent)
      .map((tooltip) => tooltip.text());

    expect(tooltipText).toEqual([
      'Rules at this level apply broadly to an equity type; for example, to all restricted stock award (RSA) plans and products.',
      'Rules apply more narrowly to a specific plan or plans.',
      'The most granular level. Rules apply to specific products.',
      'A rule ID is a brief code of up to 10 letters or numbers that defines the underlying termination rule. Examples: VOL, INV, RET, DIS.',
    ]);
  });

  it('should build equity options in requested order', () => {
    expect(spectator.component.getEquityAwardSelectOptions()).toEqual([
      { value: '', text: 'Choose an award' },
      { value: 'Cash(CSH)', text: 'Cash(CSH)' },
      {
        value: 'Restricted Stock Awards(RSA)',
        text: 'Restricted Stock Awards(RSA)',
      },
      {
        value: 'Restricted Stock Units(RSU)',
        text: 'Restricted Stock Units(RSU)',
      },
    ]);
  });

  it('should delegate onLevelChange to the store', () => {
    spectator.component.onLevelChange('plan');
    expect(mockStore.onLevelChange).toHaveBeenCalledWith('plan');
  });

  it('should expose the requested plan autocomplete values', () => {
    expect(spectator.component.planIdAutocompleteOptions).toEqual(
      EXPECTED_AUTOCOMPLETE_ITEMS,
    );
  });

  it('should expose the requested product autocomplete values', () => {
    expect(spectator.component.productIdAutocompleteOptions).toEqual(
      EXPECTED_AUTOCOMPLETE_ITEMS,
    );
  });

  it('should execute save/cancel handlers without errors', () => {
    expect(() => spectator.component.onSaveAndExit()).not.toThrow();
    expect(() => spectator.component.onSaveAndContinue()).not.toThrow();
    expect(() => spectator.component.onCancel()).not.toThrow();
  });
});
