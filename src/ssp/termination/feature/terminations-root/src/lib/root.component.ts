import { Router, RouterOutlet } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'sps-termination-terminations-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    // Keep deep links (e.g. /terminations/create) and only redirect from root entries.
    const currentRoute = this.router.url;
    if (
      currentRoute &&
      currentRoute !== '/' &&
      currentRoute !== '/terminations'
    ) {
      return;
    }

    const url = this.resolveInitialRoute();
    this.router.navigateByUrl(url, { replaceUrl: true });
  }

  private resolveInitialRoute(): string {
    const win = this.document
      .defaultView as unknown as Window;
    const href = win?.location?.href ?? '';

    if (href.includes('/gosps/to/termination-rules')) {
      return 'terminations/schedules';
    } else if (href.includes('/gosps/to/participant-terminations')) {
      return 'terminations/management';
    }

    // In local development default to termination-rules context
    const hostname = win?.location?.hostname ?? '';
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'terminations/schedules';
    }

    return 'terminations/management';
  }
}