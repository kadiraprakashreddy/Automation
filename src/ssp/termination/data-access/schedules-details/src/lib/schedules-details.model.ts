export interface SchedulesDetails {
  id: string;
  name: string;
}

export interface SchedulesDetailsRestResponse {
  schedulesDetailsList: SchedulesDetails[];
}
