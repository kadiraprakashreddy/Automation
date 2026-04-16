import { signal } from '@angular/core';
import { Management } from '../management.model';

export const dataMock: Management[] = [
  {
    id: '1',
    name: 'Jill',
  },
  {
    id: '2',
    name: 'Jack',
  },
];

export const mockManagementRestResponse = {
  managementList: dataMock,
};

export const emptyManagementListResponse = {
  managementList: [],
};

export const mockManagementStore = {
  data: signal(dataMock),
  hasData: signal(true),
  isResolved: signal(true),
  isLoading: signal(false),
  error: signal(false),
  loadingStatus: signal({}),
};
