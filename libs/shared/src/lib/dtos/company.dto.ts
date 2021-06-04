import { BaseDto } from './base.dto';
import { KeyValueDto } from './key-value.dto';

export interface CompanyDto extends BaseDto {
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

export interface CompanyInfoDto extends BaseDto {
  occupation: KeyValueDto,
  no: number,
  address: string,
  work: KeyValueDto,
  phone: string,
  company: string,
  fax: string,
  name: string,
  prefecture: KeyValueDto,
  name_pe: string,
  business: KeyValueDto,
  size: KeyValueDto,
  website: any,
  agreement_file: any[],
  representative: string,
  representative_katakana: string,
  representative_position: KeyValueDto,
  representative_email: string,
  acceptance_remark: string
}

interface NameDto {
  en_US: string;
  ja_JP: string;
  vi_VN: string;
}

interface WebsiteDto {
  name: string;
  url: string;
}