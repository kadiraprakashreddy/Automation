import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { GeneralInfoStore } from '@fmr-ap160368/sps-termination-data-access-schedules-create';
import { TooltipComponent } from '@fmr-ap167419/shared-design-system-ui-core';

import { GeneralInfoComponent } from './general-info.component';

const EXPECTED_AUTOCOMPLETE_ITEMS = [{ value: 'Test 1', label: 'Test 1' }];

describe('GeneralInfoComponent', () => {
  let spectator: Spectator<GeneralInfoComponent>;

  const mockStore = {
    currentLevel: jest.fn(() => 'equity'),
    showsPlanField: jest.fn(() => false),
    showsProductField: jest.fn(() => false),
    onLevelChange: jest.fn(),
  };

  const createComponent = createComponentFactory({
    component: GeneralInfoComponent,
    providers: [
      {
        provide: GeneralInfoStore,
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

  it('should render step title', () => {
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
      'A termination ID is a brief code of up to 10 letters or numbers that defines the underlying termination rule. Examples: VOL, INV, RET, DIS.',
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
      'A termination ID is a brief code of up to 10 letters or numbers that defines the underlying termination rule. Examples: VOL, INV, RET, DIS.',
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
});
