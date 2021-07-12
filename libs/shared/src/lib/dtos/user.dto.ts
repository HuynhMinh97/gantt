import { BaseDto } from "@ait/shared";
import { KeyValueDto } from "./key-value.dto";
export interface UserDto extends BaseDto {
  username?: string;
  email?: string;
  password?: string;
}


export interface UserJobSetting extends BaseDto {
  user_id: string,
  business: KeyValueDto[],
  desired_occupation: KeyValueDto,
  residence_status: KeyValueDto[],
  japanese_skill: KeyValueDto,
  prefecture: KeyValueDto[],
  immigration_date: number,
  remark: string;
  qualification: string;
  desired_salary: number;
  salary_type: KeyValueDto;
}
export interface UserCertificateInfo extends BaseDto {
  certificate_no1: string,
  japanese_skill: KeyValueDto,
  japanese_skill_certificate: string,
  qualification: string,
  qualification_certificate: string,
}

