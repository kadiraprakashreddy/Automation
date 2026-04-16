import { AppComponent } from './app.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory(AppComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it("should set modalView to 'selector' when cash-transfer event with 'cash-transfer' detail is dispatched", () => {
    expect(spectator.component.modalView).toBe('');

    const event = new CustomEvent('cash-transfer', { detail: 'cash-transfer' });
    document.dispatchEvent(event as Event);

    expect(spectator.component.modalView).toBe('selector');
  });

  it("should set modalView to 'pending' when cash-transfer event with 'pending-withdrawals' detail is dispatched", () => {
    spectator.component.modalView = '';

    const event = new CustomEvent('cash-transfer', {
      detail: 'pending-withdrawals',
    });
    document.dispatchEvent(event as Event);

    expect(spectator.component.modalView).toBe('pending');
  });

  it('should not change modalView for unrelated event details', () => {
    spectator.component.modalView = '';

    const event = new CustomEvent('cash-transfer', {
      detail: 'unknown-detail',
    });
    document.dispatchEvent(event as Event);

    // stays unchanged
    expect(spectator.component.modalView).toBe('');
  });
});
