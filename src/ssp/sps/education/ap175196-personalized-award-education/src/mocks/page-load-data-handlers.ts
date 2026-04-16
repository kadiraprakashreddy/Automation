/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
const defaultScenario = {
  data: {
    brokerageAccountNumber: 'X123456789',
  },
  apis: {
    PAGE_CONTENT_URL:
      '/spsplanservices/stockplans/employer=123456789/content/spsAwardEducation?accountNumber=123456789',
    GRANT_SUMMARY_URL:
      '/spsplanservices/stockplans/relationships/clients/123456789/grant-summary',
    PLAN_SERVICES_URL:
      '/spsplanservices/stockplans/relationships/clients/123456789/plans',
    CUSTOMER_DETAILS_URL:
      '/spsplanservices/stockplans/relationships/clients/123456789/customer-details',
    TAX_DETAILS_URL:
      '/spsplanservices/stockplans/relationships/clients/123456789/tax-details',
  },
  getRealm: () => '/mybenefits',
};

export const PageLoadDataHandlers: { [key: string]: any } = {
  default: defaultScenario,
};
