import { ParticipantAwardDetailsRootHandlers } from '@fmr-ap160368/sps-award-management-award-details-feature-participant-award-details-root/testing';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(...ParticipantAwardDetailsRootHandlers);
