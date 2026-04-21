import {
  RestMockData,
  createGetHandler,
  createPostHandler,
} from '@fmr-ap167419/tools-mswjs';

import {
  emptyManagementListResponse,
  mockManagementRestResponse,
} from './management.mock';
import { mockSdlResponse } from './sdl-response.mock';
import { ManagementRestResponse } from '../management.model';

import { MANAGEMENT_URL } from '../management.service';
//import { ParticipantSparkNavBarDataAccessHandlers } from '@fmr-ap160368/employer-platform-data-access-spark-nav-bar/testing';
import { DefaultBodyType } from 'msw';
import { mockParticipantTerminationContentRestResponse } from './sdl-participant-content.mock';
// import { mockEmploymentDetailsRestResponse } from './employment-details-response.mock';
import { mockTermModelRestResponse } from './term-model-response.mock';
import { mocktermRuleIdsRestResponse } from './term-rule-ids-large-results.mock';
import { mockParticipantWidResponse } from './participant-wid-response.mock';
import { mockUpdateTerminationDetailsResponse } from './update-termination-details-response.mock';
import { mockTermModelRestErrorResponse } from './term-model-error-response.mock';
//error mocks
import { mockTridionHttpErrorRestResponse } from './termination-management/failure/tridionHttpErrorResponse.mock';
import { mockEmploymentDetailsAdjustFailureRestResponse } from './employment-details-response-adjust-failure.mock';
import { mockParticipantDetailsResponse } from './participant-details.mock';
import { mockParticipantTocResponse } from './participant-toc.mock';
import { mockEmploymentDetailsTerminatedRestResponse } from './employment-details-terminated-response.mock';

const ManagementResponseMockRest: RestMockData<
  ManagementRestResponse,
  { path: string }
> = {
  default: {
    data: mockManagementRestResponse,
  },
  emptyListScenario: {
    data: emptyManagementListResponse,
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

const TerminationModelContentResponseMockRest: RestMockData<
  DefaultBodyType,
  Record<never, string>
> = {
  default: {
    data: mockSdlResponse,
  },
  emptyListScenario: {
    data: emptyManagementListResponse,
    switch: {
      referrerQs: 'emptyListScenario=true',
    },
  },
  serverErrorScenario: {
    data: mockTridionHttpErrorRestResponse,
    switch: {
      referrerQs: 'serverErrorScenario=true',
    },
    responseStatus: 500,
  },
};

const ParticipantTerminationContentResponseMockRest: RestMockData<
  DefaultBodyType,
  Record<never, string>
> = {
  default: {
    // TODO: Replace with actual mock data for termination model content
    data: mockParticipantTerminationContentRestResponse,
  },
  emptyListScenario: {
    data: emptyManagementListResponse,
    switch: {
      referrerQs: 'emptyListScenario=true',
    },
  },
  serverErrorScenario: {
    data: mockTridionHttpErrorRestResponse,
    switch: {
      referrerQs: 'serverErrorScenario=true',
    },
    responseStatus: 500,
  },
};

const TermRuleIdsResponseMockRest: RestMockData<
  DefaultBodyType,
  Record<never, string>
> = {
  default: {
    // TODO: Replace with actual mock data for termination model content
    data: mocktermRuleIdsRestResponse,
  },
  emptyListScenario: {
    data: emptyManagementListResponse,
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

const EmploymentDetailsResponseMockRest: RestMockData<
  DefaultBodyType,
  Record<never, string>
> = {
  default: {
    // TODO: Replace with actual mock data for termination model content
    // data: mockEmploymentDetailsRestResponse,
    data: mockEmploymentDetailsTerminatedRestResponse,
  },
  emptyListScenario: {
    data: emptyManagementListResponse,
    switch: {
      referrerQs: 'emptyListScenario=true',
    },
  },
  serverErrorScenario: {
    data: mockTermModelRestErrorResponse,
    switch: {
      referrerQs: 'serverErrorScenario=true',
    },
    responseStatus: 500,
  },
};

const TermModelResponseMockRest: RestMockData<
  DefaultBodyType,
  Record<never, string>
> = {
  default: {
    data: mockTermModelRestResponse,
  },
  emptyListScenario: {
    data: emptyManagementListResponse,
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
  clientErrorScenario: {
    data: mockTermModelRestErrorResponse,
    switch: {
      referrerQs: 'clientErrorScenario=true',
    },
    responseStatus: 400,
  },
};

const WidResponseMockRest: RestMockData<
  DefaultBodyType,
  Record<never, string>
> = {
  default: {
    data: mockParticipantWidResponse,
  },
  emptyListScenario: {
    data: emptyManagementListResponse,
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

const UpdateTerminationDetailsResponseMockRest: RestMockData<
  DefaultBodyType,
  Record<never, string>
> = {
  default: {
    data: mockUpdateTerminationDetailsResponse,
  },
  emptyListScenario: {
    data: emptyManagementListResponse,
    switch: {
      referrerQs: 'emptyListScenario=true',
    },
  },
  serverErrorScenario: {
    data: mockEmploymentDetailsAdjustFailureRestResponse,
    switch: {
      referrerQs: 'serverErrorScenario=true',
    },
    responseStatus: 500,
  },
};

const ParticipantDetailsResponseMockRest: RestMockData<
  DefaultBodyType,
  Record<never, string>
> = {
  default: {
    data: mockParticipantDetailsResponse,
  },
  serverErrorScenario: {
    data: mockEmploymentDetailsAdjustFailureRestResponse,
    switch: {
      referrerQs: 'serverErrorScenario=true',
    },
    responseStatus: 500,
  },
};

const ParticipantTocResponseMockRest: RestMockData<
  DefaultBodyType,
  Record<never, string>
> = {
  default: {
    data: mockParticipantTocResponse,
  },
  serverErrorScenario: {
    data: mockEmploymentDetailsAdjustFailureRestResponse,
    switch: {
      referrerQs: 'serverErrorScenario=true',
    },
    responseStatus: 500,
  },
};

export const ManagementDataAccessHandlers = [
  //  ...ParticipantSparkNavBarDataAccessHandlers,
  createGetHandler(MANAGEMENT_URL, ManagementResponseMockRest),
  createGetHandler(
    '/plansponsor/sps-terminations/api/employers/:employerId/content/termination-models',
    TerminationModelContentResponseMockRest,
  ),
  createGetHandler(
    '/plansponsor/sps-terminations/api/employers/:employerId/content/participant-terminations',
    ParticipantTerminationContentResponseMockRest,
  ),
  createGetHandler(
    '/plansponsor/sps-terminations/api/employers/:employerId/participants/participant-id/termination-ids',
    TermRuleIdsResponseMockRest,
  ),
  createGetHandler(
    '/plansponsor/sps-terminations/api/employers/:employerId/participants/participant-id/employment-details',
    EmploymentDetailsResponseMockRest,
  ),
  createGetHandler(
    '/plansponsor/sps-terminations/api/employers/:employerId/participants/participant-id/term-models',
    TermModelResponseMockRest,
  ),
  createGetHandler(
    '/plansponsor/participantsearch/api/relationships/employer=:employerId/selected-participants/current',
    WidResponseMockRest,
  ),
  createPostHandler(
    '/api/termination-management/post/success.json',
    UpdateTerminationDetailsResponseMockRest,
  ),
  createGetHandler(
    '/plansponsor/participantv2/api/participantdetails?type=view',
    ParticipantDetailsResponseMockRest,
  ),
  createGetHandler(
    '/plansponsor/participantv2/api/v2/toc',
    ParticipantTocResponseMockRest,
  ),
];
