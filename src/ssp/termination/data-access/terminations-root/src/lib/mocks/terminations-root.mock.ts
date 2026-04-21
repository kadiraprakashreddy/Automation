import { signal } from '@angular/core';
import { TerminationsRoot } from '../terminations-root.model';

export const dataMock: TerminationsRoot[] = [
  {
    id: '1',
    name: 'Jill',
  },
  {
    id: '2',
    name: 'Jack',
  },
];

export const mockTerminationsRootRestResponse = {
  terminationsRootList: dataMock,
};

export const emptyTerminationsRootListResponse = {
  terminationsRootList: [],
};

export const mockTerminationsRootStore = {
  data: signal(dataMock),
  hasData: signal(true),
  isResolved: signal(true),
  isLoading: signal(false),
  error: signal(false),
  loadingStatus: signal({}),
};
