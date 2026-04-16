import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  AnalyticsTag,
  AnalyticsUtilService,
  IConfirmationModalContent,
  IMessages,
  ManagementStore,
  OPERATIONS,
  ResourceBundles,
  TermModelConstant,
  UpdateTerminationDetailsService,
  XtracDetailsModel,
  xtracNumberValidator,
} from '@fmr-ap160368/sps-termination-data-access-management';

import {
  ButtonComponent,
  ButtonType,
  ButtonVariant,
  FieldGroupComponent,
  FormActionsComponent,
  FormComponent,
  IconModule,
  InlineMessageComponent,
  InputComponent,
  InputType,
  LabelComponent,
  LinkModule,
  LoadingIndicatorModule,
  MessageVariant,
  ModalComponent,
  ModalState,
} from '@fmr-ap167419/shared-design-system-ui-core';

@Component({
  selector: 'sps-termination-confirmation-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FieldGroupComponent,
    FormActionsComponent,
    FormComponent,
    IconModule,
    InlineMessageComponent,
    InputComponent,
    LabelComponent,
    LinkModule,
    ModalComponent,
    LoadingIndicatorModule,
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementConfirmationModalComponent {
  /**
   * Inputs / Outputs must be declared before other public instance fields
   * to satisfy the member-ordering ESLint rule.
   */
  public readonly content = signal<IConfirmationModalContent | undefined>(
    undefined,
  );
  public readonly modelType = input<OPERATIONS | null | undefined>();

  public readonly cancelEvent = output<void>();
  public readonly confirmEvent = output<XtracDetailsModel>();

  public readonly inputType = InputType;
  public readonly buttonVariant = ButtonVariant;
  public readonly buttonType = ButtonType;
  public readonly alertVariant = MessageVariant;

  /**
   * Form group for confirmation modal
   */
  public confirmationForm: UntypedFormGroup;

  /**
   * Error messages
   */
  public messages!: IMessages;

  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly analyticsService = inject(AnalyticsUtilService);
  private readonly updateTerminationDetailsService = inject(
    UpdateTerminationDetailsService,
  );
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly store = inject(ManagementStore);

  /**
   * Creates an instance of ConfirmationModalComponent.
   * And initializes confirmation form group.
   *
   * @param formBuilder
   * @memberof ConfirmationModalComponent
   */
  constructor() {
    this.confirmationForm = this.formBuilder.group({
      xtracId: ['', [Validators.required, xtracNumberValidator()]],
      xtracComments: ['', []],
    });

    effect(() => this.loadSdlContent());
  }

  /**
   * Getter for xtracId FormControl of confirmationForm
   *
   * @readonly
   * @memberof ConfirmationModalComponent
   */
  get xtracId() {
    return this.confirmationForm.get(TermModelConstant.XTRACID);
  }

  /**
   * Load SDL content into the component signals and messages.
   * Extracted to a method so it can be invoked from tests.
   */
  public loadSdlContent(): void {
    if (this.store.hasSDLContent()) {
      const sdlContent = this.store.sdlContent();
      if (sdlContent) {
        const resourceBundles = sdlContent.resourceBundles as ResourceBundles;
        this.content.set(resourceBundles.adjustTerminationConfirmationOverlay);
        this.messages = resourceBundles.messages;
        this.cdr.markForCheck();
      }
    }
  }

  /**
   * on clicking cancel button this method will emit
   * cancel event.
   *
   * @memberof ConfirmationModalComponent
   */
  public cancel() {
    if (this.modelType() === OPERATIONS.ADJUST) {
      this.analyticsService.pageActionSubmitAnalytics(
        AnalyticsTag.userActionForSiteEvent,
        AnalyticsTag.terminationManagement,
        {
          actionDetail: AnalyticsTag.adjustModelCancel,
          pageType: AnalyticsTag.terminationManagement,
        },
      );
    } else if (this.modelType() === OPERATIONS.REVERSE) {
      this.analyticsService.pageActionSubmitAnalytics(
        AnalyticsTag.userActionForSiteEvent,
        AnalyticsTag.terminationManagement,
        {
          actionDetail: AnalyticsTag.reverseModelCancel,
          pageType: AnalyticsTag.terminationManagement,
        },
      );
    }
    this.cancelEvent.emit();
  }

  /**
   * on clicking confirm button this method will emit
   * confirm event with xtrac number as event data
   *
   * @memberof ConfirmationModalComponent
   */
  public onConfirm(): void {
    this.confirmEvent.emit(this.confirmationForm.value);
  }

  /**
   * triggering this method calling cancel event
   *
   * @param event
   * @memberof ConfirmationModalComponent
   */
  public closingOverlay(event: ModalState) {
    if (event === TermModelConstant.CLOSED) {
      this.cancel();
    }
  }

  /**
   * Method use to submit analytics for adjust and reverse action
   *
   * @param tagName
   * @memberof ConfirmationModalComponent
   */
  public submitAnalyticsForAdjustAndReverse(tagName: string) {
    if (this.modelType() === OPERATIONS.ADJUST) {
      this.updateTerminationDetailsService.submitAnalyticsForAdjust(tagName);
    } else if (this.modelType() === OPERATIONS.REVERSE) {
      this.updateTerminationDetailsService.submitAnalyticsForReverse(tagName);
    }
  }
}
