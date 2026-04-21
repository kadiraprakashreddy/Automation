import { RestMockData, createGetHandler } from '@fmr-ap167419/tools-mswjs';

import {
  emptySchedulesDetailsListResponse,
  mockSchedulesDetailsRestResponse,
} from './schedules-details.mock';
import { SchedulesDetailsRestResponse } from '../schedules-details.model';

import { SCHEDULES_DETAILS_URL } from '../schedules-details.service';

const SchedulesDetailsResponseMockRest: RestMockData<
  SchedulesDetailsRestResponse,
  { path: string }
> = {
  default: {
    data: mockSchedulesDetailsRestResponse,
  },
  emptyListScenario: {
    data: emptySchedulesDetailsListResponse,
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

export const SchedulesDetailsDataAccessHandlers = [
  createGetHandler(SCHEDULES_DETAILS_URL, SchedulesDetailsResponseMockRest),
];
