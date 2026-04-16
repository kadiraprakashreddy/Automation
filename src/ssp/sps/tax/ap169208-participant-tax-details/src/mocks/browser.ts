import { ParticipantTaxDetailsRootHandlers } from '@fmr-ap160368/sps-tax-feature-participant-tax-details-root/testing';
import { PageLoadDataHandlers } from './page-load-data-handlers';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(...ParticipantTaxDetailsRootHandlers);

export const setPageLoadData = () => {
  // set window vars based on query params
  const queryString = window.location.search;
  const urlParams: URLSearchParams = new URLSearchParams(queryString);
  // look for ?page-load-data=
  const currentScenario = urlParams.get('page-load-data') || 'default';
  const currentScenarioMapping = PageLoadDataHandlers[currentScenario];
  // add page data to window
  Object.assign(window, currentScenarioMapping);
};
