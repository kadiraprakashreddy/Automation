/* eslint-disable @nx/enforce-module-boundaries */
import { TerminationsRootHandlers } from '@fmr-ap160368/sps-termination-feature-terminations-root/testing';
import { ManagementDataAccessHandlers } from '@fmr-ap160368/sps-termination-data-access-management/testing';
import { pageLoadDataHandlers } from '@fmr-ap160368/employer-platform-feature-spark-nav-bar';
import { setPageLoadData } from '@fmr-ap167419/tools-mock-page-load-data';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(
  ...TerminationsRootHandlers,
  ...ManagementDataAccessHandlers,
);
setPageLoadData(pageLoadDataHandlers);
