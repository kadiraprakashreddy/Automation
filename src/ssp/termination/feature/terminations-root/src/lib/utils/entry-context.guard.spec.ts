import { DefaultUrlSerializer, UrlTree } from '@angular/router';
import { EntryContextService } from './entry-context.service';
import {
  evaluateEntryContext,
  participantTerminationsGuard,
} from './entry-context.guard';
import { SpectatorRouting, createRoutingFactory } from '@ngneat/spectator/jest';
import { DOCUMENT } from '@angular/common';
import { RootComponent } from '../root.component';

const createDocumentWithHref = (href: string) =>
  new Proxy(document, {
    get: (target, prop) => {
      if (prop === 'defaultView') {
        return { location: { href } };
      }
      const value = Reflect.get(target, prop);
      return typeof value === 'function' ? value.bind(target) : value;
    },
  });

describe('Entry Context Guards', () => {
  const urlSerializer = new DefaultUrlSerializer();
  const mockRouter = {
    parseUrl: (url: string) => urlSerializer.parse(url),
  };

  const mockEntryContext = (
    context: 'participant-terminations' | 'termination-rules',
  ) =>
    ({
      context,
      defaultRoute:
        context === 'termination-rules'
          ? 'terminations/schedules'
          : 'terminations/management',
    }) as EntryContextService;

  describe('when context is participant-terminations', () => {
    const entryContext = mockEntryContext('participant-terminations');

    it('should allow participant-terminations routes', () => {
      const result = evaluateEntryContext(
        entryContext,
        mockRouter as never,
        'participant-terminations',
      );
      expect(result).toBe(true);
    });

    it('should redirect termination-rules routes to management', () => {
      const result = evaluateEntryContext(
        entryContext,
        mockRouter as never,
        'termination-rules',
      );
      expect(result).toBeInstanceOf(UrlTree);
      expect((result as UrlTree).toString()).toBe('/terminations/management');
    });
  });

  describe('when context is termination-rules', () => {
    const entryContext = mockEntryContext('termination-rules');

    it('should allow termination-rules routes', () => {
      const result = evaluateEntryContext(
        entryContext,
        mockRouter as never,
        'termination-rules',
      );
      expect(result).toBe(true);
    });

    it('should redirect participant-terminations routes to schedules', () => {
      const result = evaluateEntryContext(
        entryContext,
        mockRouter as never,
        'participant-terminations',
      );
      expect(result).toBeInstanceOf(UrlTree);
      expect((result as UrlTree).toString()).toBe('/terminations/schedules');
    });
  });

  describe('CanMatchFn integration', () => {
    let spectator: SpectatorRouting<RootComponent>;

    const createComponent = createRoutingFactory({
      component: RootComponent,
      detectChanges: false,
      providers: [
        {
          provide: DOCUMENT,
          useValue: createDocumentWithHref(
            'https://host.example.com/gosps/to/participant-terminations',
          ),
        },
      ],
    });

    it('participantTerminationsGuard delegates to evaluateEntryContext via inject()', () => {
      spectator = createComponent();
      const result = spectator.runInInjectionContext(() =>
        participantTerminationsGuard({} as never, [] as never),
      );
      expect(result).toBe(true);
    });
  });
});
