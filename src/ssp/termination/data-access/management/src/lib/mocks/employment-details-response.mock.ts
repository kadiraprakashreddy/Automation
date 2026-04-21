export const mockEmploymentDetailsRestResponse = {
  hireDate: '2021-05-03',
  adjustedHireDate: '2021-05-03',
  rehireDate: '2021-05-03',
  groupBand: 'ABCDE',
  yearsOfService: '8 years and 6 months',
  salaryBand: 'AB',
  titleCode: 'Title',
  terminationDetails: {
    terminationDate: null,
    terminationId: 'RETIRED',
    terminationReversalIndicator: 'Y',
    activeRuleIndicator: 'Y',
  },
  links: [
    {
      description: 'Update termination details',
      rel: 'update',
      type: 'application/json',
      href: '/api/termination-management/post/success.json',
    },
    {
      description: 'Fetch term model details',
      rel: 'award',
      type: 'application/json',
      href: '/plansponsor/sps-terminations/api/employers/000718029/participants/participant-id/term-models',
    },
    {
      description: 'Modeling participant terminations.',
      rel: 'video',
      type: null,
      href: '/plansponsor/SSODirector/Start?SSOVendorID=PSWBC&ContentID=Default&inChildWindow=Y&ShowDisclaimer=N&Practice=XX&Target=video817&ClientID=123456789',
    },
  ],
};
