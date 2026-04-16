import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  inject,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import {
  AnalyticsTag,
  AnalyticsUtilService,
  ErrorAnalytics,
  ErrorMessage,
  IAward,
  IMessages,
  IPlanDetail,
  ITerminationDetail,
  ITerminationModelResourceBundle,
  ITerminationModellingSearchSection,
  ManagementStore,
  TermModelConstant,
  dateComparisonValidator,
  dateValidator,
  isNullOrUndefinedOrEmpty,
} from '@fmr-ap160368/sps-termination-data-access-management';
import { CommonModule, DatePipe } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { AutocompleteOption } from '@fmr-ap153177/fdskit/dist/lib/src/fds-autocomplete/fds-autocomplete';

import {
  AutocompleteComponent,
  ButtonComponent,
  ButtonVariant,
  DatepickerComponent,
  FormComponent,
  InlineMessageComponent,
  InputComponent,
  LabelComponent,
  LinkModule,
  MessageVariant,
  MicrocopyComponent,
  ValidationRules,
  ValidationText,
} from '@fmr-ap167419/shared-design-system-ui-core';

@Component({
  selector: 'sps-termination-fetch-termination-models',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormComponent,
    LabelComponent,
    InputComponent,
    InlineMessageComponent,
    MicrocopyComponent,
    LinkModule,
    AutocompleteComponent,
    ButtonComponent,
    DatepickerComponent,
  ],
  templateUrl: './fetch-termination-models.component.html',
  styleUrl: './fetch-termination-models.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpsTerminationFeatureManagementFetchTerminationModelsComponent
  implements OnInit
{
  readonly store = inject(ManagementStore);

  public alertVariant = MessageVariant;
  public buttonVariant = ButtonVariant;

  /**
   *
   *
   * @type {ITerminationModellingSearchSection}
   * @memberof FetchTerminationModelsComponent
   */
  public searchContent!: ITerminationModellingSearchSection;

  /**
   * Informational messages
   *
   * @type {IMessages}
   * @memberof FetchTerminationModelsComponent
   */
  public messages!: IMessages;

  /**
   *
   *
   * @type {ITerminationDetail}
   * @memberof FetchTerminationModelsComponent
   */
  public termContent!: ITerminationDetail;

  /**
   *
   *
   * @type {FormGroup}
   * @memberof FetchTerminationModelsComponent
   */
  public termModelForm!: UntypedFormGroup;

  /**
   * flag to show info when user tries to type more than 10 char for term id
   *
   * @type {boolean}
   * @memberof FetchTerminationModelsComponent
   */
  public userTryingToTypeMoreThan10CharForId: boolean = false;

  /**
   * flag to trigger analytics when user tries to type more than 10 char for term id
   *
   * @type {boolean}
   * @memberof FetchTerminationModelsComponent
   */
  public analyticsUserTryingToTypeMoreThan10Char: boolean = false;

  /**
   * flag to show info when user enters invalid term id
   *
   * @type {boolean}
   * @memberof FetchTerminationModelsComponent
   */
  public invalidTerminationId: boolean = false;

  /**
   * flag to show when user enters invalid pattern
   *
   * @type {boolean}
   * @memberof FetchTerminationModelsComponent
   */
  public invalidPatternTerminationId: boolean = false;

  /**
   * @type {IAward}
   * @memberof AwardsComponent
   */
  public awards: IAward | null | undefined;

  /**
   * @type {IPlanDetail[]}
   * @memberof AwardsComponent
   */
  public plans!: IPlanDetail[];
  /**
   *
   *
   * @type {ErrorMessage}
   * @memberof AwardsComponent
   */
  public errorMessage: ErrorMessage | null | undefined;

  public isClicked: boolean = false;

  public termId: string | undefined = '';

  public displayDateErrors: boolean = true;

  public displayTermIdError: boolean = true;

  public termRuleIds: string[] = [];

  public isGrkClient: boolean = false;

  // minimum characters needed for auto suggestions
  public autocompleteMinLength: number = 1;

  // maximum characters for auto suggestions
  public autocompleteMaxLength: number = 10;

  // autocomplete validation rules
  public autocompleteRules: ValidationRules;

  // autocomplete validation rules text
  public autocompleteRulesText: ValidationText;

  // filtered list of term rule ids based on user input for autocomplete dropdown
  public filteredTermRuleIds: string[] = [];

  // options for autocomplete component
  public autocompleteOptions: AutocompleteOption[] = [];

  // current date to compare with termination date for validation
  public currentDate: Date = new Date();

  // regex pattern for term id validation
  private readonly termIdPattern: RegExp =
    /^([a-zA-Z0-9\-&_+ /!@#$%^*()[\];:<>={},.|'"\\])+$/;

  private readonly formBuilder = inject(UntypedFormBuilder);
  private readonly datePipe = inject(DatePipe);
  private readonly analyticsService = inject(AnalyticsUtilService);
  private readonly cdr = inject(ChangeDetectorRef);

  // fetch list of suggested term rule IDs available for a given participant from store
  constructor() {
    effect(() => {
      this.handleStoreChanges();
    });
  }

  /**
   * Getter for terminationDate FormControl of termModelForm
   *
   * @readonly
   * @memberof FetchTerminationModelsComponent
   */
  get terminationDate() {
    return this.termModelForm.get(TermModelConstant.TERMINATION_DATE);
  }

  /**
   * Getter for ruleId FormControl of termModelForm
   *
   * @readonly
   * @memberof FetchTerminationModelsComponent
   */
  get ruleId() {
    return this.termModelForm.get(TermModelConstant.RULE_ID);
  }

  initiateForm() {
    this.termModelForm = this.formBuilder.group({
      terminationDate: [
        null,
        [
          dateValidator(),
          dateComparisonValidator(
            this.convertToDate(
              this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
            ),
          ),
        ],
      ],
      ruleId: [''],
    });
    this.updateAdjustFormData();
  }

  ngOnInit(): void {
    this.currentDate = this.convertToDate(
      this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
    );
    this.initiateForm();
    this.ruleId?.valueChanges
      .pipe(debounceTime(50)) // debounce to limit number of calls for every keystroke for better performance
      .subscribe(() => {
        const id = this.ruleId?.value || '';
        if (id) {
          this.filteredTermRuleIds = this.termRuleIds
            .filter((idValue) => {
              return idValue.toLowerCase().includes(id.toLowerCase());
            })
            .slice(0, 500); // Only show first 500 matches to improve the component performance;
        } else {
          this.filteredTermRuleIds = [];
        }
        this.autocompleteOptions = this.filteredTermRuleIds.map((id) => ({
          value: id,
          label: id,
        })) as AutocompleteOption[];
        if (id.length > 10) {
          this.userTryingToTypeMoreThan10CharForId = true;
          this.analyticsUserTryingToTypeMoreThan10Char = true;
        } else {
          this.userTryingToTypeMoreThan10CharForId = false;
        }
        this.cdr.markForCheck();
      });

    this.autocompleteRules = JSON.stringify({
      autocomplete: {
        min: this.autocompleteMinLength,
        max: this.autocompleteMaxLength,
        regex: this.termIdPattern.source,
      },
    }) as ValidationRules;
  }

  fetch() {
    this.terminationDate?.markAsDirty();
    this.terminationDate?.updateValueAndValidity();
    this.ruleId?.markAsDirty();
    this.termIDValidation();
    this.isClicked = true;
    this.displayDateErrors = true;
    this.displayTermIdError = true;
    if (
      this.termModelForm.valid &&
      !this.invalidTerminationId &&
      !this.invalidPatternTerminationId &&
      !this.userTryingToTypeMoreThan10CharForId
    ) {
      const termDate = this.constructISODate();
      this.termId = this.ruleId?.value?.toUpperCase().trim();
      this.ruleId?.patchValue(this.termId);
      const termModelUrl = this.store.getLink(TermModelConstant.AWARD);

      this.store.fetchTermModel([
        termModelUrl ?? '',
        termDate,
        this.termId ?? '',
      ]);
    } else {
      this.termModelErrorAnalytics();
    }
    this.analyticsUserTryingToTypeMoreThan10Char = false;
  }

  /**
   * method to do term ID validation on blur
   *
   * @param event
   * @memberof FetchTerminationModelsComponent
   */
  termIDValidation() {
    const termId = this.ruleId?.value?.trim() || '';
    if (termId.length < 1 && this.ruleId?.dirty) {
      this.invalidTerminationId = true;
    } else {
      this.invalidTerminationId = false;
    }
    if (!this.termIdPattern.test(termId) && termId.length > 0) {
      this.invalidPatternTerminationId = true;
    } else {
      this.invalidPatternTerminationId = false;
    }
    if (termId.length > 10) {
      this.userTryingToTypeMoreThan10CharForId = true;
    } else {
      this.userTryingToTypeMoreThan10CharForId = false;
    }
  }

  cancel() {
    this.terminationDate?.patchValue(null);
    this.ruleId?.patchValue('');
    this.terminationDate?.setErrors(null);
    this.termId = '';
    this.invalidPatternTerminationId = false;
    this.invalidTerminationId = false;
    this.userTryingToTypeMoreThan10CharForId = false;
    this.analyticsUserTryingToTypeMoreThan10Char = false;
    this.analyticsService.pageActionSubmitAnalytics(
      AnalyticsTag.userActionForSiteEvent,
      AnalyticsTag.terminationModeling,
      {
        actionDetail: AnalyticsTag.reset,
        pageType: AnalyticsTag.employeeDetails,
      },
    );
  }

  public handleStoreChanges() {
    this.handleTermRuleIdsUpdate();
    this.handleSDLContentUpdate();
    this.handleTermModelsUpdate();
    this.handleFetchTermModelError();
  }

  /**
   * Handles changes from the autocomplete component for the Term rule ID.
   */
  public onAutocompleteChange(event: Event) {
    const ruleIdObj = (event as CustomEvent)?.detail?.value;
    setTimeout(() => {
      this.ruleId?.patchValue(ruleIdObj?.value);
    }, 10);
  }

  /**
   * Handles the event emitted from the autocomplete component when user clicks on X button to
   * clear the input field
   * @param event - event emitted from the autocomplete component
   */
  public onAutocompleteDispatch(event: Event) {
    // patching ruleId required to trigger the valueChanges subscription to update the filtered list and options for autocomplete dropdown when user clicks on X button to clear the input field, as the valueChanges does not get triggered on dispatch event from autocomplete component
    const ruleIdObj = (event as CustomEvent)?.detail?.value;
    this.ruleId?.patchValue(ruleIdObj);
    // handle blank value for user click X button to clear the autocomplete input field
    if (!(event as CustomEvent)?.detail?.value) {
      setTimeout(() => {
        // reset everything related to term rule ID input
        this.ruleId?.patchValue('');
        this.termId = '';
        this.invalidPatternTerminationId = false;
        this.invalidTerminationId = false;
        this.userTryingToTypeMoreThan10CharForId = false;
        this.analyticsUserTryingToTypeMoreThan10Char = false;
        this.analyticsService.pageActionSubmitAnalytics(
          AnalyticsTag.userActionForSiteEvent,
          AnalyticsTag.terminationModeling,
          {
            actionDetail: AnalyticsTag.reset,
            pageType: AnalyticsTag.employeeDetails,
          },
        );
      }, 10);
    }
  }

  /**
   * this method is for disabling the inline alert message
   * for date
   *
   * @memberof FetchTerminationModelsComponent
   */
  public resetDateErrors() {
    this.displayDateErrors = false;
  }

  /**
   * this method is for disabling the inline alert message
   * for Term Id
   *
   * @memberof FetchTerminationModelsComponent
   */
  public resetTermIdError() {
    this.displayTermIdError = false;
  }

  private handleTermRuleIdsUpdate(): void {
    if (!this.store.hasTermRuleIds()) {
      return;
    }
    const response = this.store.termRuleIds();
    this.termRuleIds = Array.from(new Set(response?.terminationRuleIds ?? []));
    if (this.termRuleIds?.length > 1000) {
      this.filteredTermRuleIds = this.termRuleIds.slice(0, 1000);
    } else {
      this.filteredTermRuleIds = this.termRuleIds;
    }
    this.autocompleteOptions = this.filteredTermRuleIds.map((id) => ({
      value: id,
      label: id,
    })) as AutocompleteOption[];
    this.isGrkClient = !!response?.grkClient;
    this.cdr.markForCheck();
  }

  private handleSDLContentUpdate(): void {
    if (!this.store.hasSDLContent()) {
      return;
    }
    const resourceBundles = this.store.sdlContent()
      ?.resourceBundles as ITerminationModelResourceBundle;
    this.searchContent = resourceBundles?.terminationModellingSearchSection;
    this.termContent = resourceBundles?.terminationDetailsSection;
    this.messages = resourceBundles?.messages;

    const invalidTerminationIdMessage = this.messages?.invalidTerminationId
      .replace('&lt;', '<')
      .replace('&gt;', '>')
      .replace('\\\\', '\\');
    this.autocompleteRulesText = JSON.stringify({
      autocomplete: {
        min:
          'Search must be at least ' +
          this.autocompleteMinLength +
          ' character(s) long.',
        max: this.messages.terminationIdLimitReached,
        regex: invalidTerminationIdMessage,
      },
    }) as ValidationText;
  }

  private handleTermModelsUpdate(): void {
    if (!this.store.hasTermModels()) {
      return;
    }
    const termModels = this.store.termModels();
    this.errorMessage = null;
    this.awards = termModels;
    this.plans = termModels?.plans ?? [];
    this.handleFormTagging(termModels!, this.termModelForm.touched);
  }

  private handleFetchTermModelError(): void {
    if (!this.store.fetchTermModelError()) {
      return;
    }
    this.plans = [];
    this.errorMessage = this.store.fetchTermModelError();
    if (this.isClicked === false) {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
        { pageStatus: AnalyticsTag.termModelSystemError },
      );
    } else {
      this.analyticsService.pageViewSubmitAnalytics(
        AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
        {
          pageStatus: AnalyticsTag.termModelSystemError,
          viewName: AnalyticsTag.calculate,
        },
      );
    }
  }

  /**
   * Function to handle form tagging/analytics
   * @param res
   * @param formTouched
   */
  private handleFormTagging(res: IAward, formTouched: boolean) {
    if (this.isClicked === false) {
      if (res?.divisionalRestricted) {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          { pageStatus: AnalyticsTag.fullPlanRestriction },
        );
      } else if (res?.partialDivisionalRestricted) {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          { pageStatus: AnalyticsTag.partialPlanRestriction },
        );
      } else if (this.plans?.length < 1) {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          { pageStatus: AnalyticsTag.noResultFound },
        );
      } else if (formTouched) {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          { pageStatus: AnalyticsTag.results },
        );
      } else {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          { pageStatus: AnalyticsTag.resultsPrePopulated },
        );
      }
    } else if (this.isClicked === true) {
      if (res?.divisionalRestricted) {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          {
            pageStatus: AnalyticsTag.fullPlanRestriction,
            viewName: AnalyticsTag.calculate,
          },
        );
      } else if (res?.partialDivisionalRestricted) {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          {
            pageStatus: AnalyticsTag.partialPlanRestriction,
            viewName: AnalyticsTag.calculate,
          },
        );
      } else if (this.plans?.length < 1) {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          {
            pageStatus: AnalyticsTag.noResultFound,
            viewName: AnalyticsTag.calculate,
          },
        );
      } else {
        this.analyticsService.pageViewSubmitAnalytics(
          AnalyticsTag.terminationModeling + ':' + AnalyticsTag.status,
          {
            pageStatus: AnalyticsTag.results,
            viewName: AnalyticsTag.calculate,
          },
        );
      }
    }
  }

  /**
   * method to convert date string in format YYYY-MM-dd to Date object
   *
   * @private
   * @param dateString
   * @return
   * @memberof FetchTerminationModelsComponent
   */
  private convertToDate(dateString: string): Date {
    return new Date(
      +dateString.substring(0, 4),
      +dateString.substring(5, 7) - 1,
      +dateString.substring(8, 10),
    );
  }

  /**
   * Method to return ISO Date string for term model
   *
   * @readonly
   * @memberof FetchTerminationModelsComponent
   */
  private constructISODate(): string {
    const dateValue = this.terminationDate?.value;
    return this.datePipe.transform(dateValue, 'yyyy-MM-dd')!;
  }

  private updateAdjustFormData(): void {
    const terminationDetails =
      this.store.employmentDetails()?.terminationDetails;
    if (!isNullOrUndefinedOrEmpty(terminationDetails)) {
      if (!isNullOrUndefinedOrEmpty(terminationDetails?.terminationDate)) {
        const date = terminationDetails?.terminationDate;
        let initialTerminationDate: Date;
        if (typeof date === 'string') {
          // Normalize hyphens to slashes for consistent parsing across browsers
          initialTerminationDate = new Date(date.replace(/-/g, '/'));
        } else {
          // If it's already a Date (or other acceptable value), construct a Date from it
          // Cast via `unknown` first to satisfy strict TS checks for nullable unions
          initialTerminationDate = new Date(date as unknown as Date);
        }
        this.terminationDate?.setValue(initialTerminationDate);
        this.terminationDate?.markAsDirty();
      }

      if (
        !isNullOrUndefinedOrEmpty(terminationDetails?.terminationId) &&
        !isNullOrUndefinedOrEmpty(terminationDetails?.terminationDate)
      ) {
        this.ruleId?.setValue(terminationDetails?.terminationId);
        this.ruleId?.markAsDirty();
        this.termIDValidation();
      }
    }
  }

  private termModelErrorAnalytics() {
    const errorAnalyticsArray: ErrorAnalytics[] = [];
    if (this.terminationDate?.errors?.['invalidDate']) {
      const errorAnalytics: ErrorAnalytics = {};
      errorAnalytics.form_field_name = this.termContent.dateLabel;
      errorAnalytics.error_message = this.messages.invalidDate;
      errorAnalyticsArray.push(errorAnalytics);
    } else if (this.terminationDate?.errors?.['lessThanHireDate']) {
      const errorAnalytics: ErrorAnalytics = {};
      errorAnalytics.form_field_name = this.termContent.dateLabel;
      errorAnalytics.error_message =
        this.messages.terminationDateBeforeTodaysDate;
      errorAnalyticsArray.push(errorAnalytics);
    }

    if (this.invalidTerminationId) {
      const errorAnalytics: ErrorAnalytics = {};
      errorAnalytics.form_field_name = this.termContent.idLabel;
      errorAnalytics.error_message = this.messages.emptyTerminationId;
      errorAnalyticsArray.push(errorAnalytics);
    }
    if (this.invalidPatternTerminationId) {
      const errorAnalytics: ErrorAnalytics = {};
      errorAnalytics.form_field_name = this.termContent.idLabel;
      errorAnalytics.error_message = this.messages.invalidTerminationId;
      errorAnalyticsArray.push(errorAnalytics);
    }
    if (this.analyticsUserTryingToTypeMoreThan10Char) {
      const errorAnalytics: ErrorAnalytics = {};
      errorAnalytics.form_field_name = this.termContent.idLabel;
      errorAnalytics.error_message = this.messages.terminationIdLimitReached;
      errorAnalyticsArray.push(errorAnalytics);
    }
    this.analyticsService.pageActionSubmitAnalytics(
      AnalyticsTag.formError,
      AnalyticsTag.terminationModeling,
      {
        errorAnalyticsArray: errorAnalyticsArray,
        formName: AnalyticsTag.employeeDetails,
      },
    );
  }
}
