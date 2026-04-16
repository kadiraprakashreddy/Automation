/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;

  const sparkConfig = {
    spsClientId: 'client',
    sparkHostName: 'host',
    userId: 'user',
    pageContextId: 'page',
    participantIdValue: 'pid',
    participantIdType: 'ptype',
  };

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [RouterOutlet],
    providers: [],
  });

  beforeEach(() => {
    // ensure no leftover globals
    delete (global as any).config;
    delete (global as any).txntoken;
  });

  it('is created', () => {
    (global as any).config = { pageContextUser: 'nope' };
    spectator = createComponent({ detectChanges: false });
    expect(spectator.component).toBeTruthy();
  });

  it('isSparkContext returns true when pageContextUser equals spark', () => {
    (global as any).config = { pageContextUser: 'spark' };
    spectator = createComponent({ detectChanges: false });
    expect(spectator.component.isSparkContext()).toBe(true);
  });

  it('isSparkContext returns false otherwise', () => {
    (global as any).config = { pageContextUser: 'something' };
    spectator = createComponent({ detectChanges: false });
    expect(spectator.component.isSparkContext()).toBe(false);
  });

  it('calls loadSparkNavContextConfig in ngOnInit when spark context', () => {
    (global as any).config = { pageContextUser: 'spark' };
    (global as any).txntoken = 'token';
    spectator = createComponent({ detectChanges: false });

    const loader = jest.fn();
    (spectator.component as any).loadSparkNavContextConfig = loader;

    spectator.component.ngOnInit(); // trigger ngOnInit without rendering child components
    expect(loader).toHaveBeenCalled();
  });

  it('does not call loadSparkNavContextConfig in ngOnInit when not spark context', () => {
    (global as any).config = { pageContextUser: 'no-spark' };
    spectator = createComponent({ detectChanges: false });

    const loader = jest.fn();
    (spectator.component as any).loadSparkNavContextConfig = loader;

    spectator.component.ngOnInit();
    expect(loader).not.toHaveBeenCalled();
  });

  it('loadSparkNavContextConfig assigns config and creates NavbarContext', () => {
    (global as any).config = sparkConfig;
    (global as any).txntoken = 'txn';
    spectator = createComponent({ detectChanges: false });

    spectator.component.loadSparkNavContextConfig();

    expect(spectator.component.terminationsSparkNavbarConfig).toBe(sparkConfig);
    expect(spectator.component.sparkNavbarContext).toBeDefined();
  });
});
