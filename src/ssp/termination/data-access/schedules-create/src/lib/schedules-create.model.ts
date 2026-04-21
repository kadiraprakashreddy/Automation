export interface SchedulesCreate {
  id: string;
  name: string;
}

export interface SchedulesCreateActionLabels {
  submit: string;
  cancel: string;
}

export interface SchedulesCreatePageContent {
  pageHeader: string;
}

export interface SchedulesCreateRestResponse {
  schedulesCreateList: SchedulesCreate[];
}
