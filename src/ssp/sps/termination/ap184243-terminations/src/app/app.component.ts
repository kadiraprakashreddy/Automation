import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  OnInit,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  EmployerPlatformSparkNavBarComponent,
  NavbarContext,
  SparkNavbarWindow,
} from '@fmr-ap160368/employer-platform-feature-spark-nav-bar';

@Component({
  selector: 'fmr-ap184243-terminations',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, EmployerPlatformSparkNavBarComponent],
  styleUrls: ['./app.component.scss'],
  host: { class: 'fds-fds-theme' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'sps-termination-ap184243-terminations';

  public sparkNavbarContext!: NavbarContext;
  /**
   * Window configuration (from SPSNavApp)
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public terminationsSparkNavbarConfig: any;

  /** Constant for the spark header */
  readonly spark = 'spark';

  // Document injection token to access window variables
  private readonly document = inject(DOCUMENT);

  public ngOnInit(): void {
    if (this.isSparkContext()) {
      this.loadSparkNavContextConfig();
    }
  }

  /**
   * Load spark navbar context.
   */
  loadSparkNavContextConfig = () => {
    const { config, txntoken } = this.document
      .defaultView as unknown as SparkNavbarWindow;
    this.terminationsSparkNavbarConfig = config;
    this.sparkNavbarContext = new NavbarContext(
      this.terminationsSparkNavbarConfig.spsClientId,
      this.terminationsSparkNavbarConfig.sparkHostName,
      this.terminationsSparkNavbarConfig.userId,
      this.terminationsSparkNavbarConfig.pageContextId,
      txntoken,
      this.terminationsSparkNavbarConfig.participantIdValue,
      this.terminationsSparkNavbarConfig.participantIdType,
    );
  };

  /**
   * Check for spark context.
   * @returns
   */
  isSparkContext = () => {
    const config = (this.document.defaultView as unknown as SparkNavbarWindow)
      .config;
    const contextUser = config?.pageContextUser;
    return contextUser === this.spark;
  };
}
