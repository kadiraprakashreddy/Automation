import { RestMockData, createGetHandler } from '@fmr-ap167419/tools-mswjs';

import {
  emptySchedulesCopyListResponse,
  mockSchedulesCopyRestResponse,
} from './schedules-copy.mock';
import { SchedulesCopyRestResponse } from '../schedules-copy.model';

import { SCHEDULES_COPY_URL } from '../schedules-copy.service';

const SchedulesCopyResponseMockRest: RestMockData<
  SchedulesCopyRestResponse,
  { path: string }
> = {
  default: {
    data: mockSchedulesCopyRestResponse,
  },
  emptyListScenario: {
    data: emptySchedulesCopyListResponse,
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

export const SchedulesCopyDataAccessHandlers = [
  createGetHandler(SCHEDULES_COPY_URL, SchedulesCopyResponseMockRest),
];
