/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/naming-convention */
const defaultScenario = {
  data: {
    brokerageAccountNumber: 'X123456789',
  },
  apis: {
    PAGE_CONTENT_URL:
      '/spsplanservices/stockplans/employer=123456789/content/participanttaxdetails',
    GRANT_SUMMARY_URL:
      '/spsplanservices/stockplans/relationships/clients/123456789/grant-summary',
  },
};

export const PageLoadDataHandlers: { [key: string]: any } = {
  default: defaultScenario,
};
