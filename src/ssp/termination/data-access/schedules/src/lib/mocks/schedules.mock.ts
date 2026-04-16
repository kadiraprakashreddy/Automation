import { signal } from '@angular/core';
import { Schedules } from '../schedules.model';

export const dataMock: Schedules[] = [
  {
    id: '1',
    name: 'Jill',
  },
  {
    id: '2',
    name: 'Jack',
  },
];

export const mockSchedulesRestResponse = {
  schedulesList: dataMock,
};

export const emptySchedulesListResponse = {
  schedulesList: [],
};

export const mockSchedulesStore = {
  data: signal(dataMock),
  hasData: signal(true),
  isResolved: signal(true),
  isLoading: signal(false),
  error: signal(false),
  loadingStatus: signal({}),
};
