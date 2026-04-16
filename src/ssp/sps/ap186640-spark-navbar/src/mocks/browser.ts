import { SparkNavbarDataAccessHandlers } from '@fmr-ap160368/sps-data-access-spark-navbar/testing';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(...SparkNavbarDataAccessHandlers);
