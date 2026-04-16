/* eslint-disable @nx/enforce-module-boundaries */
import { AwardManagementRootDataAccessHandlers } from '@fmr-ap160368/sps-award-management-data-access-award-management-root/testing';
import { AwardManagementCenterDataAccessHandlers } from '@fmr-ap160368/sps-award-management-data-access-award-management-center/testing';
import { ManageSubmissionDetailsDataAccessHandlers } from '@fmr-ap160368/sps-award-management-data-access-manage-submission-details/testing';
import { SharedApiClientsDataAccessSpsFileManagementDecV1Handlers } from '@fmr-ap160368/shared-api-clients-data-access-sps-file-management-dec-v1/testing';
import { setupWorker } from 'msw/browser';

export const worker = setupWorker(
  ...AwardManagementRootDataAccessHandlers,
  ...AwardManagementCenterDataAccessHandlers,
  ...ManageSubmissionDetailsDataAccessHandlers,
  ...SharedApiClientsDataAccessSpsFileManagementDecV1Handlers,
);
