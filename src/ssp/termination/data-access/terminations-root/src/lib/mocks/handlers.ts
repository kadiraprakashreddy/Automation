import { RestMockData, createGetHandler } from '@fmr-ap167419/tools-mswjs';

import {
  emptyTerminationsRootListResponse,
  mockTerminationsRootRestResponse,
} from './terminations-root.mock';
import { TerminationsRootRestResponse } from '../terminations-root.model';

import { TERMINATIONS_ROOT_URL } from '../terminations-root.service';

const TerminationsRootResponseMockRest: RestMockData<
  TerminationsRootRestResponse,
  { path: string }
> = {
  default: {
    data: mockTerminationsRootRestResponse,
  },
  emptyListScenario: {
    data: emptyTerminationsRootListResponse,
    switch: {
      referrerQs: 'emptyListScenario=true',
    },
  },
  serverErrorScenario: {
    data: undefined,
    switch: {
      referrerQs: 'serverErrorScenario=true',
    },
    responseStatus: 500,
  },
};

export const TerminationsRootDataAccessHandlers = [
  createGetHandler(TERMINATIONS_ROOT_URL, TerminationsRootResponseMockRest),
];
