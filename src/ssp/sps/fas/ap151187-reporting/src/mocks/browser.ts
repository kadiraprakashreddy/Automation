import { ReportingRootHandlers } from '@fmr-ap160368/sps-fas-feature-reporting-root/testing';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(...ReportingRootHandlers);
