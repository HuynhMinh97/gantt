export interface bizProjectRequirement {
  name: string;
  industry: string;
  title: string;
  level: string;
  location: string;
  skill: string;
  description: string;
  remark: string;
  capacity_time_from: string;
  capacity_time_to: string;
}

export interface bizProjectDetail {
  customer: string;
  project_code: string;
  person_in_charge: string;
  status: string;
}

export interface bizProjectUser {
  name: string;
  planned: string;
  start_plan: string;
  End_plan: string;
  hours_plan: number;
  manDay_plan: number;
  manMonth_plan: number;
  remark: string;
}
