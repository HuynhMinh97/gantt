import { BaseDto } from "../base.dto";
import { KeyValueDto } from "../key-value.dto";

export interface JobInfoDto extends BaseDto  {
  business: KeyValueDto[],
  residence_status: KeyValueDto[],
  description: string,
  prefecture: KeyValueDto[],
  work_location: string,
  shift_1_from_hour: number,
  shift_1_to_hour: number,
  shift_1_from_minute: number,
  shift_1_to_minute: number,
  shift_2_from_hour: number,
  shift_2_to_hour: number,
  shift_2_from_minute: number,
  shift_2_to_minute: number,
  shift_3_from_hour: number,
  shift_3_to_hour: number,
  shift_3_from_minute: number,
  shift_3_to_minute: number,
  holiday: string,
  salary_type: KeyValueDto,
  salary_desired: number,
  salary: number,
  benefit: string,
  commission_amount: number,
  probationary_period: string,
  age: number,
  gender: KeyValueDto,
  accommodation: KeyValueDto,
  dormitory: KeyValueDto,
  search_evaluation: string,
  skills: string,
  japanese_skill: KeyValueDto,
  method: string,
  remark: string,
  status: KeyValueDto,
  company_key?: string;
  job_company?: string;
  experienced_occupation: KeyValueDto;
  desired_occupation : KeyValueDto;
}
