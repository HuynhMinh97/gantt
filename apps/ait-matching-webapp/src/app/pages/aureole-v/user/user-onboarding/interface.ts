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
  title: KeyValueDto;
  industry: KeyValueDto;
  skills: string[];

}