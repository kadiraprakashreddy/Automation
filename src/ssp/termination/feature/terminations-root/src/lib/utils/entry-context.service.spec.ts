import { SpectatorService, createServiceFactory } from '@ngneat/spectator/jest';
import { DOCUMENT } from '@angular/common';
import { EntryContextService } from './entry-context.service';

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

describe('EntryContextService', () => {
  let spectator: SpectatorService<EntryContextService>;

  const createServiceWithHref = (href: string) =>
    createServiceFactory({
      service: EntryContextService,
      providers: [
        { provide: DOCUMENT, useValue: createDocumentWithHref(href) },
      ],
    });

  describe('when url contains /gosps/to/termination-rules', () => {
    const createService = createServiceWithHref(
      'https://aws-e1-dev33-cgspss.fmr.com/plansponsor/gosps/to/termination-rules',
    );

    beforeEach(() => (spectator = createService()));

    it('should detect termination-rules context', () => {
      expect(spectator.service.context).toBe('termination-rules');
    });

    it('should return terminations/schedules as default route', () => {
      expect(spectator.service.defaultRoute).toBe('terminations/schedules');
    });
  });

  describe('when url contains /gosps/to/participant-terminations', () => {
    const createService = createServiceWithHref(
      'https://aws-e1-dev33-cgspss.fmr.com/plansponsor/gosps/to/participant-terminations',
    );

    beforeEach(() => (spectator = createService()));

    it('should detect participant-terminations context', () => {
      expect(spectator.service.context).toBe('participant-terminations');
    });

    it('should return terminations/management as default route', () => {
      expect(spectator.service.defaultRoute).toBe('terminations/management');
    });
  });

  describe('when url does not match any gosps pattern', () => {
    const createService = createServiceWithHref(
      'https://host.example.com/terminations',
    );

    beforeEach(() => (spectator = createService()));

    it('should default to participant-terminations context', () => {
      expect(spectator.service.context).toBe('participant-terminations');
    });

    it('should return terminations/management as default route', () => {
      expect(spectator.service.defaultRoute).toBe('terminations/management');
    });
  });

  describe('when defaultView is null', () => {
    const createService = createServiceFactory({
      service: EntryContextService,
      providers: [
        {
          provide: DOCUMENT,
          useValue: new Proxy(document, {
            get: (target, prop) => {
              if (prop === 'defaultView') {
                return null;
              }
              const value = Reflect.get(target, prop);
              return typeof value === 'function' ? value.bind(target) : value;
            },
          }),
        },
      ],
    });

    beforeEach(() => (spectator = createService()));

    it('should default to participant-terminations context', () => {
      expect(spectator.service.context).toBe('participant-terminations');
    });
  });

  describe('caching', () => {
    const createService = createServiceWithHref(
      'https://host.example.com/gosps/to/termination-rules',
    );

    beforeEach(() => (spectator = createService()));

    it('should return the same context on repeated access', () => {
      const first = spectator.service.context;
      const second = spectator.service.context;
      expect(first).toBe(second);
      expect(first).toBe('termination-rules');
    });
  });
});
