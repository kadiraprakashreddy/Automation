import { pageLoadDataHandlers } from '@fmr-ap160368/sps-ous-data-access-content/testing';
import { setPageLoadData } from '@fmr-ap167419/tools-mock-page-load-data';
import { worker } from '../mocks/browser';

// mock apis
export const mswWorker = worker;

export const environment = {
  production: false,
};

setPageLoadData(pageLoadDataHandlers);
