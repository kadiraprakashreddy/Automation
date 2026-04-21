/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ManagementComponent } from './management.component';
import {
  ManagementStore,
  SubmitAnalyticsService,
  TruncatePipe,
} from '@fmr-ap160368/sps-termination-data-access-management';
import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  SlicePipe,
} from '@angular/common';

describe('ManagementComponent', () => {
  let spectator: Spectator<ManagementComponent>;

  const mockStore: any = {};
  const mockTruncate = {
    transform: (v: unknown) => v,
  } as unknown as TruncatePipe;
  const mockSubmitAnalytics = {
    track: jest.fn(),
  } as unknown as SubmitAnalyticsService;

  const createComponent = createComponentFactory({
    component: ManagementComponent,
    shallow: true,
    detectChanges: false,
    imports: [HttpClientTestingModule],
    providers: [
      { provide: ManagementStore, useValue: mockStore },
      { provide: TruncatePipe, useValue: mockTruncate },
      { provide: SubmitAnalyticsService, useValue: mockSubmitAnalytics },
      { provide: DatePipe, useValue: {} },
      { provide: CurrencyPipe, useValue: {} },
      { provide: DecimalPipe, useValue: {} },
      { provide: SlicePipe, useValue: {} },
    ],
  });

  beforeEach(() => {
    TestBed.overrideProvider(ManagementStore, { useValue: mockStore });
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have injected store available on the component', () => {
    expect(spectator.component.store).toBe(mockStore);
  });

  it('should provide pipes and services from providers', () => {
    expect(spectator.inject(TruncatePipe)).toBe(mockTruncate);
    expect(spectator.inject(SubmitAnalyticsService)).toBe(mockSubmitAnalytics);
  });

  it('should proxy calls to the injected store', () => {
    const fn = jest.fn();
    // attach a test method to the mock store and confirm component.store references it
    (mockStore as any).testCall = fn;
    (spectator.component.store as any).testCall();
    expect(fn).toHaveBeenCalled();
  });
});
