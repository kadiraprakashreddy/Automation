/* eslint-disable @fmr-ap167419/tools-eslint-rules/no-angular-utils-import */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  AnalyticsTag,
  AnalyticsUtilService,
  EmploymentDetailsModel,
  ErrorMessage,
  IConfirmationModalContent,
  IMessages,
  ITerminationDetail,
  ManagementStore,
  ModifyTerminationsModel,
  OPERATIONS,
  ResourceBundles,
  STATE,
  TermModelConstant,
  TerminationDetails,
  UtilityService,
  XtracDetailsModel,
  dateComparisonValidator,
  dateValidator,
  isNullOrUndefinedOrEmpty,
} from '@fmr-ap160368/sps-termination-data-access-management';
import { FdWindowService } from '@fmr-ap123285/angular-utils';
import {
  ButtonComponent,
  ButtonType,
  ButtonVariant,
  DESIGN_SYSTEM_NAMESPACE,
  DatepickerComponent,
  FormActionsComponent,
  FormComponent,
  GridWrapperComponent,
  IconModule,
  InlineMessageComponent,
  InputComponent,
  LabelComponent,
  LabelVariant,
  LinkModule,
  LoadingIndicatorModule,
  MessageComponent,
  MessageVariant,
  MicrocopyComponent,
  Size,
  TitleComponent,
  TooltipComponent,
} from '@fmr-ap167419/shared-design-system-ui-core';
import { SpsTerminationFeatureManagementConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'sps-termination-termination-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpsTerminationFeatureManagementConfirmationModalComponent,
    MessageComponent,
    ButtonComponent,
    FormActionsComponent,
    FormComponent,
    GridWrapperComponent,
    IconModule,
    InlineMessageComponent,
    InputComponent,
    LabelComponent,
    LinkModule,
    LoadingIndicatorModule,
    TitleComponent,
    TooltipComponent,
    MicrocopyComponent,
    DatePipe,
    DatepickerComponent,
  ],
  templateUrl: './termination-detail.component.html',
  styleUrl: './termination-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementTerminationDetailComponent
  implements OnInit
{
  /**
   * Employment details populated from store
   *
   * @type {EmploymentDetailsModel}
   * @memberof TerminationDetailComponent
   */
  public employeeDetails!: EmploymentDetailsModel;

  /**
   *
   *
   * @type {OPERATIONS}
   * @memberof TerminationDetailComponent
   */
  public operation!: OPERATIONS;

  /**
   *
   *
   * @type {STATE}
   * @memberof TerminationDetailComponent
   */
  public state: STATE = STATE.INITIAL;

  /**
   *
   *
   * @type {FormGroup}
   * @memberof TerminationDetailComponent
   */
  public adjustForm!: UntypedFormGroup;

  /**
   *
   *
   * @type {boolean}
   * @memberof TerminationDetailComponent
   */
  public doAdjust!: boolean;

  /**
   *
   *
   * @type {boolean}
   * @memberof TerminationDetailComponent
   */
  public doReverse!: boolean;

  /**
   *
   *
   * @type {boolean}
   * @memberof TerminationDetailComponent
   */
  public showSpinner!: boolean;

  /**
   *
   *
   * @type {IConfirmationModalContent}
   * @memberof TerminationDetailComponent
   */
  public adjustModalContent!: IConfirmationModalContent;

  /**
   *
   *
   * @type {IConfirmationModalContent}
   * @memberof TerminationDetailComponent
   */
  public reverseModalContent!: IConfirmationModalContent;

  /**
   *
   *
   * @type {ITerminationDetail}
   * @memberof TerminationDetailComponent
   */
  public content!: ITerminationDetail;

  /**
   *
   *
   * @type {ErrorMessage}
   * @memberof TerminationDetailComponent
   */
  public errorMessages!: ErrorMessage;

  /**
   * Informational messages
   *
   * @type {IMessages}
   * @memberof TerminationDetailComponent
   */
  public messages!: IMessages;

  public initialFormData!: FormData;

  /**
   * flag to show info when user tries to type more than 10 char for term id
   *
   * @type {boolean}
   * @memberof TerminationDetailComponent
   */
  public userTryingToTypeMoreThan10CharForId: boolean = false;

  /**
   * flag to show info when user enters invalid term id
   *
   * @type {boolean}
   * @memberof FetchTerminationModelsComponent
   */
  public invalidTerminationId: boolean = false;

  public displayDateErrors: boolean = true;

  readonly wiDsNamespace = DESIGN_SYSTEM_NAMESPACE;

  public resourceBundles!: ResourceBundles;

  /**
   * page realm
   *
   * @memberof TerminationDetailComponent
   */
  public realm!: string;

  /**
   * Employee Active status
   *
   * @memberof TerminationDetailComponent
   */
  public isActive!: boolean;

  /**
   * update participant grant url
   *
   * @type {string}
   * @memberof TerminationDetailComponent
   */
  public participantGrantsUrl!: string;

  // checks if TOC V2 is available
  public isTocV2Available: boolean = false;

  // Minimum date for datepicker validation, set to hire date when initiating adjust operation
  public minDate: Date;

  public readonly buttonVariant = ButtonVariant;
  public readonly alertVariant = MessageVariant;
  public readonly labelVariant = LabelVariant;
  public readonly size = Size;
  public readonly buttonType = ButtonType;

  readonly windowService = inject(FdWindowService);
  readonly store = inject(ManagementStore);
  readonly analyticsService = inject(AnalyticsUtilService);
  readonly utilService = inject(UtilityService);
  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly slicePipe = inject(SlicePipe);
  private readonly datePipe = inject(DatePipe);
  private readonly cdr = inject(ChangeDetectorRef);
  constructor() {
    // Reactively handle SDL content from store
    effect(() => {
      if (this.store.hasSDLContent()) {
        const sdlContent = this.store.sdlContent();
        if (sdlContent) {
          this.resourceBundles = sdlContent.resourceBundles as ResourceBundles;
          this.content = this.resourceBundles.terminationDetailsSection;
          this.messages = this.resourceBundles.messages;
          this.cdr.markForCheck();
        }
      }
    });

    // Reactively handle employment details from store
    effect(() => {
      const employmentDetails = this.store.employmentDetails();
      if (employmentDetails) {
        this.employeeDetails = employmentDetails;
        this.isActive =
          employmentDetails.terminationDetails?.activeRuleIndicator ===
          TermModelConstant.Y;
        this.cdr.markForCheck();
      }
    });

    // Reactively handle termination update state changes
    effect(() => {
      // Handle loading state
      this.showSpinner = this.store.isTerminationUpdating();

      // Handle update state changes
      const updateState = this.store.terminationUpdateState();
      if (updateState !== null) {
        this.state = updateState;
      }

      // Handle update errors
      const updateError = this.store.terminationUpdateError();
      if (updateError) {
        this.errorMessages = updateError;
        this.handleUpdateError();
        this.state = STATE.ERROR;
      }

      this.cdr.markForCheck();
    });
  }

  /**
   * Get termination details from store instead of input property
   *
   * @type {TerminationDetails}
   * @memberof TerminationDetailComponent
   */
  get terminationDetails(): TerminationDetails | null | undefined {
    return this.store.employmentDetails()?.terminationDetails;
  }

  /**
   * flag to hide the reverse and adjust button - now provided by store computed property
   *
   * @type {boolean}
   * @memberof TerminationDetailComponent
   */
  get isTerminationUpdateAllowed(): boolean {
    return this.store.isTerminationUpdateAllowed();
  }

  /**
   * Getter for id FormControl of adjustForm
   *
   * @readonly
   * @memberof TerminationDetailComponent
   */
  get id() {
    return this.adjustForm.get(TermModelConstant.ID);
  }

  /**
   * Getter for terminationDate FormControl of adjustForm
   *
   * @readonly
   * @memberof TerminationDetailComponent
   */
  get terminationDate() {
    return this.adjustForm.get(TermModelConstant.TERMINATION_DATE);
  }

  /**
   * Submit analytics for adjust operations
   * @param tagName The tag name for analytics
   */
  public submitAnalyticsForAdjust(tagName: string): void {
    this.analyticsService.pageActionSubmitAnalytics(
      AnalyticsTag.userActionForSiteEvent,
      AnalyticsTag.terminationManagement,
      {
        actionDetail: 'adjust|' + tagName,
        pageType: AnalyticsTag.terminationManagement,
      },
    );
  }

  /**
   * Initialization of component takes place here
   *
   * @memberof TerminationDetailComponent
   */
  ngOnInit(): void {
    this.doAdjust = false;
    this.doReverse = false;

    // Ensure employment details are loaded from store
    if (!this.store.hasEmploymentDetails()) {
      this.store.fetchEmployeeDetails();
    }

    // SDL content (resourceBundles, content, messages) now handled reactively in constructor

    const window = this.windowService.getWindow();
    this.isTocV2Available = window?.isTocV2Available ?? false;

    this.participantGrantsUrl = window.apis.participantGrantDetails;
    if (
      this.participantGrantsUrl &&
      window.config.pageContextUser === AnalyticsTag.spark
    ) {
      this.participantGrantsUrl =
        this.participantGrantsUrl + '?spsClientId=' + window.config.spsClientId;
    }

    // Link availability is now managed through the store's computed property
    // this.store.isTerminationUpdateAllowed() provides the termination update permission
    this.realm = window.config.pageContextUser;

    // isActive is now handled reactively through the employment details effect

    if (this.state === STATE.REVERSING) {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationManagement,
        { viewName: AnalyticsTag.reverseSubmit },
      );
    } else if (this.state === STATE.ADJUSTING) {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationManagement,
        { viewName: AnalyticsTag.adjustSubmit },
      );
    } else if (this.state === STATE.INITIAL) {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationManagement,
        {},
      );
    }
  }

  /**
   * method to do termid validation on blur
   *
   * @private
   * @param event
   * @memberof FetchTerminationModelsComponent
   */
  public termIDValidation() {
    const termId = this.id?.value;

    if (termId.length < 1 && this.id?.dirty) {
      this.invalidTerminationId = true;
    } else {
      this.invalidTerminationId = false;
    }
    this.userTryingToTypeMoreThan10CharForId = false;
  }

  /**
   * this method initiates adjust process and show editable fields
   * for adjust details
   *
   * @memberof TerminationDetailComponent
   */
  public initiateAdjust() {
    let hireDate = this.store.employmentDetails()?.hireDate;

    // set minimum date for datepicker to hire date, if hire date is not available set it to 1001-01-01 to allow any date selection as part of adjust process
    this.minDate = isNullOrUndefinedOrEmpty(hireDate)
      ? new Date('1001-01-01')
      : this.convertToDate(hireDate!);

    this.analyticsService.pageActionSubmitAnalytics(
      AnalyticsTag.userActionForSiteEvent,
      AnalyticsTag.terminationManagement,
      {
        actionDetail: AnalyticsTag.adjust,
        pageType: AnalyticsTag.terminationManagement,
      },
    );

    if (isNullOrUndefinedOrEmpty(hireDate)) {
      hireDate = '1001-01-01';
    }

    this.adjustForm = this.formBuilder.group({
      terminationDate: [null, [dateValidator()]],
      id: [
        this.store.employmentDetails()?.terminationDetails?.terminationId,
        [
          Validators.pattern(
            /^([a-zA-Z0-9\-&_+ /!@#$%^*()[\];:<>={},.|'"\\]){1,10}$/,
          ),
          Validators.required,
        ],
      ],
    });

    if (!isNullOrUndefinedOrEmpty(hireDate)) {
      this.terminationDate?.addValidators(
        dateComparisonValidator(this.convertToDate(hireDate!)),
      );
      this.terminationDate?.updateValueAndValidity();
    }

    this.userTryingToTypeMoreThan10CharForId = false;

    this.updateAdjustFormData();

    this.initialFormData = { ...this.adjustForm.value };

    this.id?.valueChanges.subscribe(() => {
      const id = this.id?.value;
      if (id.length === 11) {
        this.userTryingToTypeMoreThan10CharForId = true;
      } else {
        this.userTryingToTypeMoreThan10CharForId = false;
      }
      this.id?.patchValue(this.slicePipe.transform(id, 0, 10), {
        emitEvent: false,
      });
    });

    this.state = STATE.ADJUST;
    this.operation = OPERATIONS.ADJUST;
  }

  /**
   * this method initiates reverse process and show confirmation modal popup
   * to provide xtrac number and comment
   *
   * @memberof TerminationDetailComponent
   */
  public initiateReverse(): void {
    this.reverseModalContent =
      this.resourceBundles.reverseTerminationConfirmationOverlay;
    this.doReverse = true;
    this.operation = OPERATIONS.REVERSE;
    this.analyticsService.pageActionSubmitAnalytics(
      AnalyticsTag.userActionForSiteEvent,
      AnalyticsTag.terminationManagement,
      {
        actionDetail: AnalyticsTag.reverseModel,
        pageType: AnalyticsTag.terminationManagement,
      },
    );
  }

  /**
   * this method is for disabling  the inline alert message
   *
   * @memberof TerminationDetailComponent
   */

  public resetDateErrors(): void {
    this.displayDateErrors = false;
  }

  /**
   * this method is for showing confirmation modal
   * for adjust that takes xtrac number as input
   * before confirmation
   *
   * @memberof TerminationDetailComponent
   */
  public adjust(): void {
    this.displayDateErrors = true;
    if (this.adjustForm.valid) {
      this.adjustModalContent =
        this.resourceBundles.adjustTerminationConfirmationOverlay;
      this.doAdjust = true;
      this.analyticsService.pageActionSubmitAnalytics(
        AnalyticsTag.userActionForSiteEvent,
        AnalyticsTag.terminationManagement,
        {
          actionDetail: AnalyticsTag.adjustSave,
          pageType: AnalyticsTag.terminationManagement,
        },
      );
    }
  }

  /**
   * this method will reset the temination section of the page
   * to it's inital state
   *
   * @memberof TerminationDetailComponent
   */
  public cancel(): void {
    if (this.operation === OPERATIONS.ADJUST) {
      this.analyticsService.pageActionSubmitAnalytics(
        AnalyticsTag.userActionForSiteEvent,
        AnalyticsTag.terminationManagement,
        {
          actionDetail: AnalyticsTag.adjustCancl,
          pageType: AnalyticsTag.terminationManagement,
        },
      );
    }
    this.state = STATE.INITIAL;
    this.doReverse = false;
  }

  /**
   * this method will close modal and show non editable fields
   *
   * @memberof TerminationDetailComponent
   */
  public cancelAdjustModal(): void {
    this.state = STATE.ADJUST;
    this.doAdjust = false;
  }

  /**
   * this method triggers post call
   * to submit adjust request by user
   *
   * @param XTRACNumber
   * @memberof TerminationDetailComponent
   */
  public async adjustConfirmation(xtracDetailsModel: XtracDetailsModel) {
    this.doAdjust = false;
    const employmentDetails = new EmploymentDetailsModel();

    employmentDetails.terminationDetails = new TerminationDetails(
      this.constructAdjustTerminationDate(),
      this.id?.value,
      TermModelConstant.Y,
      TermModelConstant.N,
    );

    this.store.adjustTerminationDetails(
      new ModifyTerminationsModel(employmentDetails, xtracDetailsModel),
    );
  }

  /**
   * this method triggers post call
   * to submit reverse request by user
   *
   * @param xtracDetailsModel
   * @memberof TerminationDetailComponent
   */
  public async reverseConfirmation(xtracDetailsModel: XtracDetailsModel) {
    this.doReverse = false;
    const employmentDetails = new EmploymentDetailsModel();
    employmentDetails.terminationDetails = new TerminationDetails(
      null,
      '',
      TermModelConstant.Y,
      TermModelConstant.Y,
    );

    this.store.reverseTerminationDetails(
      new ModifyTerminationsModel(employmentDetails, xtracDetailsModel),
    );
  }

  /**
   * this method is to access STATE enum from HTML template
   * for comparision
   *
   * @return
   * @memberof TerminationDetailComponent
   */
  public getStateEnum() {
    return STATE;
  }

  /**
   * construct adjust termination date to be sent to service
   *
   * @private
   * @return
   * @memberof TerminationDetailComponent
   */
  private constructAdjustTerminationDate(): string | null {
    const dateValue = this.terminationDate?.value;
    return this.datePipe.transform(dateValue, 'yyyy-MM-dd')!;
  }

  /**
   * method to convert date string in format YYYY-MM-dd to Date object
   *
   * @private
   * @param dateString
   * @return
   * @memberof TerminationDetailComponent
   */
  private convertToDate(dateString: string): Date {
    return new Date(
      +dateString.substring(0, 4),
      +dateString.substring(5, 7) - 1,
      +dateString.substring(8, 10),
    );
  }

  private updateAdjustFormData(): void {
    const terminationDetails =
      this.store.employmentDetails()?.terminationDetails;
    if (
      terminationDetails != null &&
      !isNullOrUndefinedOrEmpty(terminationDetails)
    ) {
      if (
        terminationDetails.terminationDate &&
        !isNullOrUndefinedOrEmpty(terminationDetails.terminationDate)
      ) {
        const initialTerminationDate: Date = this.convertToDate(
          terminationDetails.terminationDate,
        );
        this.terminationDate?.setValue(initialTerminationDate);
      }

      if (
        terminationDetails.terminationId &&
        !isNullOrUndefinedOrEmpty(terminationDetails.terminationId)
      ) {
        this.id?.setValue(terminationDetails.terminationId);
      }
    }
  }

  /**
   * Handle update errors with appropriate analytics
   * @private
   */
  private handleUpdateError(): void {
    if (!this.utilService.isNullOrUndefined(this.reverseModalContent)) {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationManagement + ':' + AnalyticsTag.status,
        {
          pageStatus: AnalyticsTag.sdlServiceError,
          viewName: AnalyticsTag.reverseSubmit,
        },
      );
    } else {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationManagement + ':' + AnalyticsTag.status,
        {
          pageStatus: AnalyticsTag.sdlServiceError,
          viewName: AnalyticsTag.adjustSubmit,
        },
      );
    }
  }
}
