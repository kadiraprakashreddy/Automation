export const mockParticipantTerminationContentRestResponse = {
  content: {
    components: {
      'PSW Publication Scoped Bottom JS Container': '',
      'PSW Publication Scoped CSS Container':
        '<link href="/bin-public/070_Employer_Digital_SPS_Pages/css/site.css"  type="text/css" rel="stylesheet" /><link href="/bin-public/070_Employer_Digital_SPS_Pages/css/print.css"  type="text/css" rel="stylesheet" media="print" /><link href="/bin-public/070_Employer_Digital_SPS_Pages/css/landing.css"  type="text/css" rel="stylesheet" media="all" />',
      'PSW Publication Scoped Top JS Container': '',
    },
    resourceBundles: {
      adjustTerminationConfirmationOverlay: {
        submitButtonTextForScreenReader: 'submit the adjust termination',
        cancelButtonTextForScreenReader: 'Cancel and go back',
        cancelButton: 'Cancel',
        submitButton: 'Submit',
        overlayTitle: 'Adjust termination',
        commentsLabel: 'Comments',
        warningMessage:
          "If you change the date and ID, it might modify the outcome of the termination event. Updates won't affect this termination's pending or processed distributions.",
        xtracNumberLabel: 'XTRAC number',
      },
      terminationDetailsSection: {
        reverseEditLabel: 'Reverse',
        terminationInfoMsg:
          'Update stock options and stock appreciation rights (SARs) in SPARK before you change full-value awards here',
        adjustEditLabel: 'Adjust',
        spinnerLoadingAdditionalMsg: 'This could take a minute',
        termProcessingInfoHyperLink: 'Participant grant details',
        termProcessingInfoPageText: 'page',
        terminationTitle: 'Termination',
        dateLabel: 'Date',
        termDateMicrocopy: "Select the date the participant's employment ends",
        adjustDateMicrocopy: "Select the participant's hire date",
        adjustTermProcessingMsg: "We're processing your termination adjust",
        reverseToolTipMessage:
          'This indicates if you submitted a request to adjust or reverse the most recent termination.',
        reverseTermProcessingMsg: "We're processing your termination reversal",
        termProcessingInfoMsg:
          "When we're done, you'll see these changes on the",
        spinnerLoadingMsg: 'Loading',
        idLabel: 'ID',
        idMicrocopy: 'Enter the termination rule ID',
        terminationDescription:
          "To change the date or ID after we've processed a termination, select Adjust",
        reversedLabel: 'Reversed',
        cancelButton: 'Cancel',
        cancelButtonTextForScreenReader: 'Cancel and go back',
        submitButton: 'Save',
        submitButtonTextForScreenReader: 'Save the termination',
        terminationProcessedInfoMsg:
          'Modeling is not available for terminations that have already been processed. To make updates after a termination has occurred, please submit a PSW service request.',
        autocompleteLabel: 'Search for commonly used term rules',
      },
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
      pageHeaderSection: {
        pageDescription: "Review a participant's termination information.",
        pageTitle: 'Manage termination',
        termModelPageTitle: 'Termination modeling',
        termModelPageDescription:
          "See how changing termination details may impact a participant's awards.",
        termModelVideoLabel: 'How to model terminations',
        termModelVideoLength: '(3:20)',
        autocompleteWarningMessage:
          'Auto complete suggestions for termination rule ID are not available at this time. You may still proceed to model terminations.',
      },
      reverseTerminationConfirmationOverlay: {
        submitButtonTextForScreenReader: 'submit the reverse termination',
        cancelButtonTextForScreenReader: 'Cancel and go back',
        cancelButton: 'No, don’t reverse',
        submitButton: 'Yes, reverse',
        overlayTitle: 'Reverse termination',
        commentsLabel: 'Comments',
        warningMessage:
          "Reversing might modify the outcome of the termination event. It won't affect this termination's pending or processed distributions.",
        xtracNumberLabel: 'XTRAC number',
      },
      messages: {
        terminationDateBeforeHireDate:
          "Please enter a valid termination date not before the employee's date of hire.",
        invalidTerminationId:
          "Please enter only allowed characters 0-9a-zA-Z@#&amp;*`=':./+",
        emptyTerminationId: 'Please enter termination id.',
        invalidXtracNumber:
          'Please enter a valid XTRAC ID in the format W######-DDMonYY.',
        terminationIdLimitReached: 'Please enter 10 characters or less.',
        noChangeInTerminationDetails:
          'Please enter a date or ID that is not the same as the original value.',
        invalidDate: 'Enter a valid date in Mmm dash DD dash YYYY format.',
        serviceErrorTitle: "Sorry, we've run into a small problem",
        serviceErrorBody:
          "Don't worry, it's nothing you did, just a minor system error on our end. We're working on it and hope to have it resolved soon. Please try again later.",
        updateServiceFailureTitle:
          'We are unable to process your termination update at this time.',
        updateServiceFailureBody:
          "Don't worry, it's nothing you did, just a minor system error on our end.  We're working on it and hope to have it resolved soon.  Please try again later.  Reference code",
        mockUpdateErrorTitle: 'An access error occurred',
        mockUpdateErrorBody:
          'Customer Web View users are not allowed to update client data. Reference code',
      },
      eReview: {
        eReviewNo: '1003357.1.0',
      },
    },
  },
};
