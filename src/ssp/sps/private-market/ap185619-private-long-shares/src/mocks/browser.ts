// eslint-disable-next-line @nx/enforce-module-boundaries
import { PrivateLongSharesRootHandlers } from '@fmr-ap160368/sps-private-market-feature-private-long-shares-root/testing';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(...PrivateLongSharesRootHandlers);
