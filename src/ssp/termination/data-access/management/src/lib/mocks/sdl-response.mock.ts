export const mockSdlResponse = {
  content: {
    components: {
      'PSW Publication Scoped Bottom JS Container': '',
      'PSW Publication Scoped CSS Container':
        '<link href="/bin-public/070_Employer_Digital_SPS_Pages/css/site.css"  type="text/css" rel="stylesheet" /><link href="/bin-public/070_Employer_Digital_SPS_Pages/css/print.css"  type="text/css" rel="stylesheet" media="print" /><link href="/bin-public/070_Employer_Digital_SPS_Pages/css/landing.css"  type="text/css" rel="stylesheet" media="all" />',
      'PSW Publication Scoped Top JS Container': '',
    },
    resourceBundles: {
      employeeDetailsSection: {
        adjustedDateOfHireLabel: 'Adjusted date of hire',
        salaryBandLabel: 'Salary band',
        employeeDetailsTitle: 'Employee details',
        groupBandLabel: 'Group band',
        rehireDateLabel: 'Rehire date',
        dateOfHireLabel: 'Date of hire',
        yearsOfServiceLabel: 'Years of service',
        titleCodeLabel: 'Title code',
        activeLabel: 'Active',
      },
      messages: {
        noTermDateCalculate: 'Enter a valid date.',
        planDivSecurityInfo: 'Plan and divisional restriction is applied.',
        modelResultsPlanTypesInfo:
          "This shows the impact on the participant's equity compensation benefits if termination occurs on ~(date)~.",
        datePlaceholder: '~(date)~',
        modelResultsDateFormat: 'MMM-dd-yyyy',
        esppAvailableMessage:
          'Details for ESPP awards are not currently available.',
        partialPlanDivSecurityInfo:
          'Some awards are not shown due to user access restriction for specific plan IDs.',
        terminationDateBeforeHireDate:
          "Enter a valid termination date not before the employee's date of hire.",
        serviceErrorBody:
          "Don't worry, it's nothing you did, just a minor system error on our end. We're working on it and hope to have it resolved soon. Please try again later. Reference code",
        invalidTerminationId:
          "Enter only allowed characters 0-9a-zA-Z@#&amp;*`=':./+",
        updateServiceFailureBody:
          "Don't worry, it's nothing you did, just a minor system error on our end. We're working on it and hope to have it resolved soon. Please try again later. Reference code",
        terminationIdLimitReached: 'Enter 10 characters or less.',
        mockUpdateErrorBody:
          'Customer Web View users are not allowed to update client data.',
        serviceErrorTitle: "Sorry, we've run into a small problem.",
        noChangeInTerminationDetails:
          'Enter a date or ID that is not the same as the original value.',
        noResultsFound:
          'No outstanding awards will exist for this participant as of the termination date modeled.',
        spinnerMessageTxt:
          'We are calculating the model results. This may take up to 2 minutes.',
        invalidDate: 'Enter a valid date in Mmm dash DD dash YYYY format.',
        terminationDateBeforeTodaysDate:
          "Enter a valid date for today's date or future date.",
        updateServiceFailureTitle:
          'We are unable to process your termination update at this time.',
        participantNotFound: 'Participant is not found.',
        emptyTerminationId: 'Enter a valid ID.',
        invalidXtracNumber:
          'Enter a valid XTRAC ID in the format W######-DDMonYY.',
        mockUpdateErrorTitle: 'An access error occurred.',
        noTermIDCalculate: 'Enter a valid ID.',
        minHoldingRulelbl: 'Minimum holding rule',
        minHoldingRuleMsg:
          'A minimum holding rule has been applied to the grant, resulting in award cancellation.',
        noRuleAppliedlbl: 'Rule not applied',
        noRuleAppliedMsg:
          'The term schedule modeled is not configured for this award.',
        existingTerminationlbl: 'Existing Termination Rule',
        existingTerminationMsg:
          'A different termination rule has already been applied to the grant, modeling is not available.',
        termExclusionlbl: 'Term exclusion',
        termExclusionMsg:
          'A termination rule exclusion flag has been applied to the grant, overriding the termination rule entered for modeling.',
        noRuleContent: 'noRuleApplied',
        msgContent: 'Msg',
        labelContent: 'lbl',
        customSeperationRulelbl: 'Custom rule',
        customSeparationRuleInfoMsg:
          'A custom separation rule (CSR) has been applied to the grant, overriding the termination rule entered for modeling.',
        emptyCellScreenReaderTxt: 'Empty cell',
        importantLabel: 'Important',
        isoMessageBoldText: 'Note:',
        isoMessage1:
          'Per IRS rules, participants must exercise incentive stock option (ISO) awards as follows (or they will change to a nonqualified (NQ) stock option):',
        isoMessage2:
          'Note: If a participant has a disability termination code, then they will have 12 months to exercise.',
        isoVestImmediatelyMessage:
          'Per IRS rules, incentive stock options (ISOs) will be reclassified at termination if: 1) acceleration occurs and 2) the value for a vesting year exceeds $100,000 USD limit.',
        isoProductIdMessage:
          'For product ID ~{productId}~ within ~{monthsDays}~ from termination',
        productIdPlaceholder: '~{productId}~',
        monthsDaysPlaceholder: '~{monthsDays}~',
        bannerMessageEnabled: 'Y',
        bannerMessageHeader: 'SOP and SAR awards now available for modeling',
        bannerMessageBody:
          'You can now model termination details for participants with stock option plans (SOP) and stock appreciation rights (SAR), in addition to full value awards such as RSUs, RSAs, performance, and cash. New modeling results include exercisable and unvested quantities.',
        bannerMessageDismissButton: 'Dismiss alert',
        retainedExercisableQuantityMsg:
          'This is the exercisable quantity (from pre-termination) minus the forfeited quantity for post-termination.',
        exercisableQuantityMsg:
          'Excludes canceled and exercised quantities, and filled intra-day orders (pre-termination).',
      },
      cshTableHeaders: {
        forfeitedColumnLabel: 'Forfeited value',
        retainedColumnLabel: 'Retained value',
        outstandingColumnLabel: 'Outstanding value',
      },
      perfFootnotes: {
        footNotesContent: 'Performance factor calculated as 100%.',
      },
      rsuperfTableHeaders: {
        forfeitedColumnLabel: 'Adjusted forfeited quantity',
        retainedColumnLabel: 'Adjusted retained quantity',
        outstandingColumnLabel: 'Adjusted quantity',
      },
      cshperfTableHeaders: {
        forfeitedColumnLabel: 'Adjusted forfeited value',
        retainedColumnLabel: 'Adjusted retained value',
        outstandingColumnLabel: 'Adjusted value',
      },
      rsaTableHeaders: {
        forfeitedColumnLabel: 'Forfeited quantity',
        retainedColumnLabel: 'Retained quantity',
        outstandingColumnLabel: 'Outstanding quantity',
      },
      rsuTableHeaders: {
        forfeitedColumnLabel: 'Forfeited quantity',
        retainedColumnLabel: 'Retained quantity',
        outstandingColumnLabel: 'Outstanding quantity',
      },
      sopTableHeaders: {
        retainUnvestedColumnLabel: 'Retained unvested',
        retainedExercisableQuantityColumnLabel: 'Retained exercisable quantity',
        exercisableQuantityColumnLabel: 'Exercisable quantity',
        unvestedQuantityColumnLabel: 'Unvested quantity',
        adjustedValueColumnLabel: 'Adjusted value',
        forfeitedColumnLabel: 'Forfeited quantity',
        retainedColumnLabel: 'Retained quantity',
        outstandingColumnLabel: 'Outstanding quantity',
      },
      sarTableHeaders: {
        retainUnvestedColumnLabel: 'Retained unvested',
        retainedExercisableQuantityColumnLabel: 'Retained exercisable quantity',
        exercisableQuantityColumnLabel: 'Exercisable quantity',
        unvestedQuantityColumnLabel: 'Unvested quantity',
        adjustedValueColumnLabel: 'Adjusted value',
        forfeitedColumnLabel: 'Forfeited quantity',
        retainedColumnLabel: 'Retained quantity',
        outstandingColumnLabel: 'Outstanding quantity',
      },
      eReview: {
        eReviewNo: '1003357.1.0',
      },
      modelResults: {
        sectionHeader: 'Model results',
        asOfDate: 'As of',
        exportExcel: 'Export (CSV)',
      },
      modelResultsTable: {
        totalLabel: 'Total',
        preTerminationUnvestedLabel: 'Pre-termination tranches are unvested.',
        preTerminationsectionLabel: 'PRE-TERMINATION',
        preTerminationSopSarLabel:
          'Pre-termination results include unvested and vested tranches.',
        statusColumnLabel: 'Status',
        postTerminationsectionLabel: 'POST-TERMINATION',
        postTermEstimateLabel: '(Estimate)',
        vestingDateColumnLabel: 'Vesting date',
        grantDetailsColumnLabel: 'Grant details',
        grantDetailsProductIdLabel: 'Product ID',
        grantDetailsGrantIdLabel: 'Grant ID',
        grantDetailsGrantedValueLabel: 'Granted',
        grantDetailsGrantDateLabel: 'Grant date',
        grantTypeLabel: 'Grant type',
        grantPriceLabel: 'Grant price',
        expirationDateLabel: 'Expiration date',
        terminationOutcomeLabel: 'Termination outcome',
        grantCountLabel: 'grant',
        grantsCountLabel: 'grants',
      },
      pageHeaderSection: {
        pageTitle: 'Termination modeling',
        pageDescription:
          "See how changing termination details may impact a participant's awards.",
        termModelVideoLabel: 'How to model terminations',
        termModelVideoLength: '(3:20)',
        autocompleteWarningMessage:
          'Auto complete suggestions for termination rule ID are not available at this time. You may still proceed to model terminations.',
      },
      terminationModellingSearchSection: {
        resetButtonTextForScreenReader: 'Reset Termination Modeling criteria',
        calculateButton: 'Calculate',
        calculateButtonTextForScreenReader:
          'Calculate Termination Model results',
        resetButton: 'Reset',
      },
      terminationDetailsSection: {
        terminationInfoMsg:
          'Update stock options and stock appreciation rights (SARs) in SPARK before you change full-value awards here.',
        reverseEditLabel: 'Reverse',
        submitButtonTextForScreenReader: 'Save the termination',
        submitButton: 'Save',
        cancelButtonTextForScreenReader: 'Cancel and go back',
        adjustEditLabel: 'Adjust',
        spinnerLoadingAdditionalMsg: 'This could take a minute.',
        termProcessingInfoHyperLink: 'Participant grant details',
        termProcessingInfoPageText: 'page.',
        dateLabel: 'Termination date',
        termDateMicrocopy: "Select the date the participant's employment ends",
        adjustDateMicrocopy: "Select the participant's hire date",
        terminationTitle: 'Termination',
        adjustTermProcessingMsg: "We're processing your termination updates",
        cancelButton: 'Cancel',
        reverseToolTipMessage:
          'This indicates if you submitted a request to adjust or reverse the most recent termination.',
        reverseTermProcessingMsg: "We're processing your termination reversal",
        termProcessingInfoMsg:
          "When we're done, you'll see these changes on the",
        spinnerLoadingMsg: 'Loading',
        idLabel: 'Termination rule ID',
        idMicrocopy: 'Enter the termination rule ID',
        terminationDescription:
          "To change the date or ID after we've processed a termination, select Adjust.",
        reversedLabel: 'Reversed',
        terminationProcessedInfoMsg:
          'Modeling is not available for terminations that have already been processed. To make updates after a termination has occurred, please submit a PSW service request.',
        autocompleteLabel: 'Search or enter any rule ID',
      },
      exportReport: {
        reportFileName: 'Term Model',
      },
    },
  },
};
