import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { EntryContext, EntryContextService } from './entry-context.service';

/**
 * Evaluates whether a route should be activated based on the entry context.
 * Returns `true` when allowed, or a redirect `UrlTree` otherwise.
 */
export const evaluateEntryContext = (
  entryContext: EntryContextService,
  router: Router,
  allowed: EntryContext,
): boolean | UrlTree => {
  if (entryContext.context === allowed) {
    return true;
  }
  return router.parseUrl(entryContext.defaultRoute);
};

/**
 * Creates a `canMatch` guard that only activates the route when the
 * application was entered through the given entry context.
 *
 * When the context does not match, the guard redirects to the default
 * route for the actual entry context.
 */
const entryContextGuard =
  (allowed: EntryContext): CanMatchFn =>
  (): boolean | UrlTree =>
    evaluateEntryContext(inject(EntryContextService), inject(Router), allowed);

/** Allows the route only when entered via `/gosps/to/participant-terminations`. */
export const participantTerminationsGuard: CanMatchFn = entryContextGuard(
  'participant-terminations',
);

/** Allows the route only when entered via `/gosps/to/termination-rules`. */
export const terminationRulesGuard: CanMatchFn =
  entryContextGuard('termination-rules');
