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

export const mockTerminationManagementRestResponse = {
  terminationManagementList: dataMock,
};

export const emptyTerminationManagementListResponse = {
  terminationManagementList: [],
};
