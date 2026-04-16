export const mockParticipantTocResponse = {
  labels: {
    reorderSectionsButton: 'Change navigation',
    viewEmailsNoticesLink: 'Review emails and notices',
    pageLoadErrorAlert:
      "We can't display this information right now. Please refresh the page or try again later.",
    sectionTitleContactInfo: 'Contact information',
    pageCWVAlert:
      "You're in Customer Web View, so you can't complete this action.",
    addressLabel: 'Address',
    sectionTitleGeneralDetails: 'Employee details',
    reorderSectionsErrorAlert:
      "We can't complete this action right now. Please try again later.",
    cancelButton: 'Cancel',
    sectionTitleCallHighlights: 'Recent activity',
    pageLoadingDescription: 'Loading may take a few moments.',
    downArrowA11yLabel: 'Move down by one section',
    serviceRequestsLabel: 'SERVICE REQUESTS',
    workEmailLabel: 'Work email',
    reorderSectionsModalDescription:
      'You can prioritize the sections you use most. Select the arrows to reorder the navigation. Recent activity is pinned by default.',
    viewCallDetailsLink: 'View calls to Fidelity',
    callHistoryLabel: 'CALL HISTORY',
    saveButton: 'Save',
    communicationHistoryLabel: 'COMMUNICATION HISTORY',
    pageLoadingNotice: 'Loading',
    reorderSectionsModalTitle: 'Change the navigation',
    personalEmailLabel: 'Personal email',
    mobileLabel: 'Mobile',
    viewServiceRequestsButton: 'View details for ~(PARTICIPANT_NAME)~',
    upArrowA11yLabel: 'Move up by one section',
    navigationTOCLoadErrorAlert:
      "We can't complete this action right now. Please try again later.",
    reorderSectionsErrorMessage:
      "We can't complete this action right now. Please try again later.",
  },
  links: [
    {
      id: 0,
      section: {
        name: 'Defined Contribution:',
        destinations: [
          {
            label: 'Employment Information',
            uri: '/plansponsor/go/to/participanthub/#/participanthub/dc',
            highlight: false,
          },
          {
            label: 'Additional Data Updates',
            uri: '/plansponsor/iewebapp/dcAdditionalDataUpdates.do',
            highlight: false,
          },
          {
            label: 'Death Benefit Transfer',
            uri: '/plansponsor/go/to/partDeathBenefits#/partDeathBenefits',
            highlight: false,
          },
          {
            destinationGroup: {
              name: 'ACCOUNT INFORMATION',
              destinations: [
                {
                  label: 'Investment & Source Balances',
                  uri: '/plansponsor/sponsor/balanceRedirector.do',
                  highlight: false,
                },
                {
                  label: 'Transaction History',
                  uri: '/plansponsor/sponsor/transaction_hist.do',
                  highlight: false,
                },
                {
                  label: 'Online Statement',
                  uri: '/plansponsor/sponsor/online_statement.do',
                  highlight: false,
                },
                {
                  label: 'Deductions & Investment Elections',
                  uri: '/plansponsor/sponsor/deductions_investment_elections.do',
                  highlight: false,
                },
                {
                  label: 'Company Match',
                  uri: '/plansponsor/sponsor/company_match_redirector.do',
                  highlight: false,
                },
              ],
            },
          },
          {
            destinationGroup: {
              name: 'WITHDRAWALS &amp; LOANS',
              destinations: [
                {
                  label: 'EFT & SWP Details',
                  uri: '/plansponsor/sponsor/eft_details.do',
                  highlight: false,
                },
                {
                  label: 'Loan Details',
                  uri: '/plansponsor/sponsor/loan_details.do',
                  highlight: false,
                },
                {
                  label: 'Loan Repayments',
                  uri: '/plansponsor/sponsor/loan_repayment.do',
                  highlight: false,
                },
                {
                  label: 'Disbursement History',
                  uri: '/plansponsor/sponsor/disbursementHistory.do',
                  highlight: false,
                },
                {
                  label: 'Annual Tax History',
                  uri: '/plansponsor/sponsor/annualTaxHistory.do',
                  highlight: false,
                },
                {
                  label: 'Amounts Available',
                  uri: '/plansponsor/sponsor/amounts_available.do',
                  highlight: false,
                },
                {
                  label: 'Approvals',
                  uri: '/plansponsor/sponsor/approvalInquiry.do',
                  highlight: false,
                },
              ],
            },
          },
        ],
      },
    },
    {
      id: 1,
      section: {
        name: 'Others:',
        destinations: [
          {
            label: 'Participant Overview',
            uri: '/plansponsor/participant/ParticipantLanding.psw',
            highlight: false,
          },
          {
            label: 'Beneficiary Information',
            uri: '/plansponsor/iewebapp/ShowBeneInfoByPlan.do',
            highlight: true,
          },
        ],
      },
    },
    {
      id: 2,
      section: {
        name: 'Health & Welfare:',
        destinations: [
          {
            label: 'Employment Information',
            uri: '/plansponsor/go/to/participanthub/#/participanthub/hw',
            highlight: false,
          },
          {
            label: 'Benefits',
            uri: '/plansponsor/hwnavigation/to/hwbenefits',
            highlight: false,
          },
          {
            label: 'Family Members',
            uri: '/plansponsor/hwnavigation/to/hwdependents',
            highlight: false,
          },
        ],
      },
    },
    {
      id: 3,
      section: {
        name: 'Health Savings Account:',
        destinations: [
          {
            label: 'Employment Information',
            uri: '/plansponsor/go/to/participanthub/#/participanthub/hs',
            highlight: false,
          },
          {
            label: 'Enrollment Information',
            uri: '/plansponsor/go/to/participanthub/#/participanthub/hs',
            highlight: false,
          },
          {
            label: 'Contributions',
            uri: '/plansponsor/participant/hsaContribution.psw',
            highlight: false,
          },
        ],
      },
    },
    {
      id: 4,
      section: {
        name: 'Stock Plan:',
        destinations: [
          {
            label: 'Participant Grant Details',
            uri: '/plansponsor/gosps/to/participant-grants',
            highlight: false,
          },
          {
            label: 'Employment Information',
            uri: '/plansponsor/gosps/to/participant-employment-info',
            highlight: false,
          },
          {
            label: 'Participant Documents',
            uri: '/plansponsor/participant/spsParticipantDocs.psw',
            highlight: false,
          },
          {
            label: 'Participant Tax Information',
            uri: '/plansponsor/gosps/to/participant-tax',
            highlight: false,
          },
          {
            label: 'Blackout Information',
            uri: '/plansponsor/gosps/to/blackout-information',
            highlight: false,
          },
        ],
      },
    },
  ],
};
