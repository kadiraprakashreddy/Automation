import { signal } from '@angular/core';
import { SchedulesDetails } from '../schedules-details.model';

export const dataMock: SchedulesDetails[] = [
  {
    id: '1',
    name: 'Jill',
  },
  {
    id: '2',
    name: 'Jack',
  },
];

export const mockSchedulesDetailsRestResponse = {
  schedulesDetailsList: dataMock,
};

export const emptySchedulesDetailsListResponse = {
  schedulesDetailsList: [],
};

export const mockSchedulesDetailsStore = {
  data: signal(dataMock),
  hasData: signal(true),
  isResolved: signal(true),
  isLoading: signal(false),
  error: signal(false),
  loadingStatus: signal({}),
};
