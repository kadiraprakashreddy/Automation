import { signal } from '@angular/core';
import { SchedulesCreate } from '../schedules-create.model';

export const dataMock: SchedulesCreate[] = [
  {
    id: '1',
    name: 'Jill',
  },
  {
    id: '2',
    name: 'Jack',
  },
];

export const mockSchedulesCreateRestResponse = {
  schedulesCreateList: dataMock,
};

export const emptySchedulesCreateListResponse = {
  schedulesCreateList: [],
};

export const mockSchedulesCreateStore = {
  data: signal(dataMock),
  hasData: signal(true),
  isResolved: signal(true),
  isLoading: signal(false),
  error: signal(false),
  loadingStatus: signal({}),
};
