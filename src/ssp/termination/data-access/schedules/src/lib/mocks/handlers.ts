import { RestMockData, createGetHandler } from '@fmr-ap167419/tools-mswjs';

import {
  emptySchedulesListResponse,
  mockSchedulesRestResponse,
} from './schedules.mock';
import { SchedulesRestResponse } from '../schedules.model';

import { SCHEDULES_URL } from '../schedules.service';

const SchedulesResponseMockRest: RestMockData<
  SchedulesRestResponse,
  { path: string }
> = {
  default: {
    data: mockSchedulesRestResponse,
  },
  emptyListScenario: {
    data: emptySchedulesListResponse,
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

export const SchedulesDataAccessHandlers = [
  createGetHandler(SCHEDULES_URL, SchedulesResponseMockRest),
];
