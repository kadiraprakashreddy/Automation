import { setPageLoadData, worker } from '../mocks/browser';
// mock apis
export const mswWorker = worker;
// mock window vars
setPageLoadData();

export const environment = {
  production: false,
};
