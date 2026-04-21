export interface Schedules {
  id: string;
  name: string;
}

export interface SchedulesRestResponse {
  schedulesList: Schedules[];
}
