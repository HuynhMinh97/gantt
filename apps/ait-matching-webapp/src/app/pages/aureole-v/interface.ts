import { BaseDto } from './../../../../../../libs/shared/src/lib/dtos/base.dto';
import { UserExperienceService } from './../../services/user-experience.service';
import { KeyValueDto } from '@ait/shared';

export class CompanyInfo {
  name: NameDto;
  address: string;
  business: KeyValueDto;
  occupation: KeyValueDto;
  work: KeyValueDto;
  website: WebsiteDto;
  phone: string;
  fax: string;
  size: KeyValueDto;
  representative: string;
  representative_katakana: string;
  representative_position: KeyValueDto;
  representative_email: string;
  acceptance_remark: string;
  agreement: string[];
  agreement_file: string;
  is_matching: boolean;
}

export class CompanyInfoErrorsMessage {
  name: string[];
  address: string[];
  website: string[];
  phone: string[];
  fax: string[];
  representative: string[];
  representative_katakana: string[];
  representative_position: string[];
  representative_email: string[];
  acceptance_remark: string[];
  agreement: string[];
}

export class UserExpInfoErrorsMessage {
  title: string[];
  company_working: string[];
  loacation: string[];
  is_working: string[];
  employee_type: string[];
  start_date_from: string[];
  start_date_to: string[];
  description: string[];
}

export interface UserExperienceDto extends BaseDto{

    title: KeyValueDto,
    company_working: KeyValueDto,
    location: KeyValueDto,
    employee_type: KeyValueDto,
    is_working: boolean,
    start_date_from: string,
    start_date_to: string,
    description: string,
}

export interface NameDto {
  en_US: string;
  ja_JP: string;
  vi_VN: string;
}

export interface WebsiteDto {
  name: string;
  url: string;
}

export interface ApiConfig {
  name?: string;
  api_url?: string;
  http_method?: string;
  api_key?: string;
  params?: {
    system?: string;
    database?: string;
  };

}

export interface Enforcement {
  user_id: string;
  company: string;
  api_config_key: string;
}


export enum COLOR {
  color1 = '#97D791',
  color2 = '#F5B971',
  color3 = '#10529d'
}

export enum FIELD {
  '実習生名' = 'name',
  '性別' = 'gender',
  '生年月日' = 'dob',
  '生年月日（和暦）' = 'dob_jp',
  'パスポート番号' = 'passport_number',
  '受入企業名' = 'accepting_company',
  '現住所' = 'address',
  '入国日' = 'immigration_date',
  '雇用開始日' = 'employment_start_date',
  '許可年月日（2号移行（予定）年月日）' = 'no2_permit_date',
  '3号試験学科' = 'no3_exam_dept_date',
  '3号試験学科合否' = 'no3_exam_dept_pass',
  '3号試験実技' = 'no3_exam_practice_date',
  '3号試験実技合否' = 'no3_exam_practice_pass',
  '許可年月日（3号移行(予定)年月日）' = 'no3_permit_date',
  '職種' = 'occupation',//update for industry,
  '実習生名（カナ）' = 'name_kana', // name on header card
  '在留資格' = 'residence_status',
  '希望の給料' = 'current_salary',
  '希望の職種（分野）' = 'business',
  '都道府県' = 'prefecture',
}

export const fields = [
  '実習生名',
  '性別',//性別
  '生年月日',// 生年月日
  '都道府県',
  '職種',//職種,
  '在留資格',//在留資格
  '希望の給料',//希望の給料
  '希望の職種（分野）',
]
