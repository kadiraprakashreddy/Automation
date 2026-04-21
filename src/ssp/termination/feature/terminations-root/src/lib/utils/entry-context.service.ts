import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Entry point contexts for the terminations app.
 *
 * - `participant-terminations` – entered via `/gosps/to/participant-terminations`
 * - `termination-rules` – entered via `/gosps/to/termination-rules`
 */
export type EntryContext = 'participant-terminations' | 'termination-rules';

/**
 * Reads the browser URL **once** on first access and caches the detected
 * entry context for the lifetime of the application.
 *
 * The app is served behind two different SPS gateway paths:
 * - `/gosps/to/participant-terminations` → management workflow
 * - `/gosps/to/termination-rules` → schedules / create / details workflow
 */
@Injectable({ providedIn: 'root' })
export class EntryContextService {
  private readonly document = inject(DOCUMENT);
  private cachedContext: EntryContext | undefined;

  get context(): EntryContext {
    if (!this.cachedContext) {
      this.cachedContext = this.detect();
    }
    return this.cachedContext;
  }

  get defaultRoute(): string {
    return this.context === 'termination-rules'
      ? 'terminations/schedules'
      : 'terminations/management';
  }

  private detect(): EntryContext {
    const win = this.document.defaultView as Window | null;
    const href = win?.location?.href ?? '';

    if (href.includes('/gosps/to/termination-rules')) {
      return 'termination-rules';
    }
    // Local dev URLs do not include gateway prefixes; default to rules flow.
    const hostname = win?.location?.hostname ?? '';
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'termination-rules';
    }
    return 'participant-terminations';
  }
}
