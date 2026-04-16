import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'fmr-ap176357-cash-transfer',
  template: `<sps-ous-money-out-cash-transfer
    [modalView]="modalView"
    (modalClosed)="modalView = ''"
  ></sps-ous-money-out-cash-transfer>`,
  styles: [''],
  host: { class: 'fds-fds-theme' },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public modalView: string = '';

  @HostListener('document:cash-transfer', ['$event'])
  public onInputViewChange(event: CustomEvent): void {
    if (event.detail === 'cash-transfer') {
      this.modalView = 'selector';
    } else if (event.detail === 'pending-withdrawals') {
      this.modalView = 'pending';
    }
  }
}
