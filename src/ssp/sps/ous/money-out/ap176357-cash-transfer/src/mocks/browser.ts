import { ContentDataAccessHandlers } from '@fmr-ap160368/sps-ous-data-access-content/testing';
import { ExchangerateDataAccessHandlers } from '@fmr-ap160368/sps-data-access-exchangerate/testing';
import { CashTransferDataAccessHandler } from '@fmr-ap160368/sps-ous-money-out-data-access-cash-transfer/testing';
import { setupWorker } from 'msw/browser';

export const CashTransferDataAccessHandlers = [
  ...ContentDataAccessHandlers,
  ...ExchangerateDataAccessHandlers,
  ...CashTransferDataAccessHandler,
];

export const worker = setupWorker(...CashTransferDataAccessHandlers);
