import { RestMockData, createGetHandler } from '@fmr-ap167419/tools-mswjs';

import {
  emptySchedulesCreateListResponse,
  mockSchedulesCreateRestResponse,
} from './schedules-create.mock';
import { SchedulesCreateRestResponse } from '../schedules-create.model';

import { SCHEDULES_CREATE_URL } from '../schedules-create.service';

const SchedulesCreateResponseMockRest: RestMockData<
  SchedulesCreateRestResponse,
  { path: string }
> = {
  default: {
    data: mockSchedulesCreateRestResponse,
  },
  emptyListScenario: {
    data: emptySchedulesCreateListResponse,
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

export const SchedulesCreateDataAccessHandlers = [
  createGetHandler(SCHEDULES_CREATE_URL, SchedulesCreateResponseMockRest),
];
