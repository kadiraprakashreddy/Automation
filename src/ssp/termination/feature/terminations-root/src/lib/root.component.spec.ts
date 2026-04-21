import { RootComponent } from './root.component';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SpectatorRouting, createRoutingFactory } from '@ngneat/spectator/jest';

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

describe('RootComponent', () => {
  let spectator: SpectatorRouting<RootComponent>;
  let router: Router;

  const createComponentWithHref = (href: string) =>
    createRoutingFactory({
      component: RootComponent,
      detectChanges: false,
      providers: [
        {
          provide: DOCUMENT,
          useValue: createDocumentWithHref(href),
        },
      ],
    });

  describe('when url contains /gosps/to/participant-terminations', () => {
    const createComponent = createComponentWithHref(
      'https://host.example.com/gosps/to/participant-terminations',
    );

    it('should navigate to terminations/management', () => {
      spectator = createComponent();
      router = spectator.inject(Router);
      jest.spyOn(router, 'navigateByUrl');

      spectator.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'terminations/management',
        { replaceUrl: true },
      );
    });
  });

  describe('when url contains /gosps/to/termination-rules', () => {
    const createComponent = createComponentWithHref(
      'https://host.example.com/gosps/to/termination-rules',
    );

    it('should navigate to terminations/schedules', () => {
      spectator = createComponent();
      router = spectator.inject(Router);
      jest.spyOn(router, 'navigateByUrl');

      spectator.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'terminations/schedules',
        { replaceUrl: true },
      );
    });
  });

  describe('when url contains /gosps/to/termination-rules with hash fragment', () => {
    const createComponent = createComponentWithHref(
      'https://host.example.com/gosps/to/termination-rules#/details',
    );

    it('should navigate to terminations/schedules', () => {
      spectator = createComponent();
      router = spectator.inject(Router);
      jest.spyOn(router, 'navigateByUrl');

      spectator.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'terminations/schedules',
        { replaceUrl: true },
      );
    });
  });

  describe('when url does not match any gosps pattern', () => {
    const createComponent = createComponentWithHref(
      'https://host.example.com/terminations',
    );

    it('should default to terminations/management', () => {
      spectator = createComponent();
      router = spectator.inject(Router);
      jest.spyOn(router, 'navigateByUrl');

      spectator.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'terminations/management',
        { replaceUrl: true },
      );
    });
  });

  describe('when defaultView is null', () => {
    const createComponent = createRoutingFactory({
      component: RootComponent,
      detectChanges: false,
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

    it('should default to terminations/management', () => {
      spectator = createComponent();
      router = spectator.inject(Router);
      jest.spyOn(router, 'navigateByUrl');

      spectator.detectChanges();

      expect(router.navigateByUrl).toHaveBeenCalledWith(
        'terminations/management',
        { replaceUrl: true },
      );
    });
  });

  describe('template', () => {
    const createComponent = createComponentWithHref(
      'https://host.example.com/terminations',
    );

    it('should render a router-outlet', () => {
      spectator = createComponent();
      spectator.detectChanges();

      expect(spectator.query('router-outlet')).toExist();
    });
  });
});
