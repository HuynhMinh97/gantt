import { Int } from '@nestjs/graphql';
import { BaseDto, KeyValueDto } from '@ait/shared';

export interface KeyValueCheckedDto {
  _key: string;
  value: string;
  class: string;
  parent_code: string;
  code: string;
  checked: boolean;
  name: string;
}

export enum ONBOARD {
  SPECIAL_CHAR = '#$@'
}

export interface UserOnboardingDto extends BaseDto {
  first_name: string;
  last_name: string;
  katakana?: string;
  romaji?: string;
  gender: KeyValueDto;
  bod: Date;
  phone_number: number;
  about: string;
  country_region: KeyValueDto;
  postcode: string;
  province_city: KeyValueDto;
  district: KeyValueDto;
  ward: KeyValueDto;
  address: string;
  floor_building: string;
  company_working: KeyValueDto;
  current_job_title: KeyValueDto;
  industry_working:KeyValueDto;
  current_job_skills: string[];
  current_job_level: KeyValueDto;
  skills: string;
}

export interface JobSettingDto extends BaseDto {
  job_setting_title: KeyValueDto;
  industry: KeyValueDto;
  location: KeyValueDto;
  skills: string;
  industryList: string;
  job_setting_skills: string[];
  job_setting_level: KeyValueDto;
  available_time_from: number;
  available_time_to: number;
  available_time : string;
}

