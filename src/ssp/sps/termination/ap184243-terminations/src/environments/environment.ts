import { worker } from '../mocks/browser';
import { setPageLoadData } from '@fmr-ap167419/tools-mock-page-load-data';
// mock apis
export const mswWorker = worker;

// Mocking what would be available on the window.
const pageLoadDataHandlers = {
  default: {
    mockWindowVar1: 'foo',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __experience: {
      context: {
        employer: '000000000',
        plan: '123456',
        pointOfEntry: 'nb',
        selectedCustomer: '',
        env: 'stage',
      },
    },
  },
  errorScenario: {
    mockWindowVar1: 'bar',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __experience: {
      context: {
        employer: '000000000',
        plan: '123456',
        pointOfEntry: 'nb',
        selectedCustomer: '',
        env: 'stage',
      },
    },
  },
};

// Mock Window Variables
setPageLoadData(pageLoadDataHandlers);

export const environment = {
  production: false,
};
