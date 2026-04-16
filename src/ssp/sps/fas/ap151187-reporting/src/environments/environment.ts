/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  apiAppDownUrl,
  apiServerErrorUrl,
  contentUrl,
  linksLedgerServiceErrorUrl,
  linksMultipleLedgersUrl,
  linksNoUpdateEntitlementUrl,
  linksSingleLedgerUrl,
  linksUpdateLedgerErrorSingleLedgerUrl,
  linksValuationTileApproveAfterUpdateErrorUrl,
  linksValuationTileApproveErrorUrl,
  linksValuationTileDownloadErrorUrl,
  linksValuationTileNoAccessMultipleLedgersUrl,
  linksValuationTileNoAccessSingleLedgerUrl,
  linksValuationTileNullUrl,
  linksValuationTileState2SingleLedgerUrl,
  linksValuationTileState3SingleLedgerUrl,
} from '@fmr-ap160368/sps-fas-data-access-reporting-root';
import { worker } from '../mocks/browser';
import { setPageLoadData } from '@fmr-ap167419/tools-mock-page-load-data';
// mock apis
export const mswWorker = worker;

const mockEnsightenDataSurface = {
  Client: '000714443',
  effectiveUserId: 'prelog2',
  loginScope: 'post-login',
  Plan: '',
  p2: 'eea1e4f5ee5c8311e5ac870a2aba15aa77',
  userId: 'prelog2',
};

const mockConfig = {
  pageContext: 'financialaccounting',
  pageContextUser: 'plansponsor',
};

// Mocking what would be available on the window.
const pageLoadDataHandlers = {
  default: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksSingleLedgerUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
    txntoken: '1234',
  },
  noUpdateEntitlement: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksNoUpdateEntitlementUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
  },
  multipleLedgers: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksMultipleLedgersUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
    txntoken: '1234',
  },
  tridionError: {
    config: mockConfig,
    apis: {
      content: apiServerErrorUrl,
      links: linksSingleLedgerUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
  },
  linksError: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: apiServerErrorUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
  },
  ledgerServiceError: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksLedgerServiceErrorUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
  },
  updateLedgerError: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksUpdateLedgerErrorSingleLedgerUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
    txntoken: '1234',
  },
  appDownError: {
    config: mockConfig,
    apis: {
      content: apiAppDownUrl,
      links: linksSingleLedgerUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
  },
  nullValuationResponse: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksValuationTileNullUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
  },
  valuationTileNoAccessSingleLedger: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksValuationTileNoAccessSingleLedgerUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
  },
  valuationTileNoAccessMultiLedgers: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksValuationTileNoAccessMultipleLedgersUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
  },
  valuationTileState2SingleLedger: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksValuationTileState2SingleLedgerUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
    txntoken: '1234',
  },
  valuationTileState3SingleLedger: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksValuationTileState3SingleLedgerUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
    txntoken: '1234',
  },
  valuationTileApproveError: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksValuationTileApproveErrorUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
    txntoken: '1234',
  },
  valuationTileApproveAfterUpdateError: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksValuationTileApproveAfterUpdateErrorUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
    txntoken: '1234',
  },
  valuationTileDownloadError: {
    config: mockConfig,
    apis: {
      content: contentUrl,
      links: linksValuationTileDownloadErrorUrl,
    },
    ensightenDataSurface: mockEnsightenDataSurface,
    txntoken: '1234',
  },
};

// Mock Window Variables
setPageLoadData(pageLoadDataHandlers);

export const environment = {
  production: false,
};
