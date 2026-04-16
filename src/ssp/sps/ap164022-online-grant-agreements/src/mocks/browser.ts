import { OnlineGrantAgreementsRootHandlers } from '@fmr-ap160368/sps-feature-online-grant-agreements-root/testing';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(...OnlineGrantAgreementsRootHandlers);
