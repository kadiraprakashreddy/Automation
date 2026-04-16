import { signal } from '@angular/core';
import { SchedulesCopy } from '../schedules-copy.model';

export const dataMock: SchedulesCopy[] = [
  {
    id: '1',
    name: 'Jill',
  },
  {
    id: '2',
    name: 'Jack',
  },
];

export const mockSchedulesCopyRestResponse = {
  schedulesCopyList: dataMock,
};

export const emptySchedulesCopyListResponse = {
  schedulesCopyList: [],
};

export const mockSchedulesCopyStore = {
  data: signal(dataMock),
  hasData: signal(true),
  isResolved: signal(true),
  isLoading: signal(false),
  error: signal(false),
  loadingStatus: signal({}),
};
