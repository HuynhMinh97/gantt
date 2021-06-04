export interface BaseDto {
  _id: string;
  _key: string;
  company: string;
  lang: string;
  user_id: string;
  active_flag: boolean;
  create_by: string;
  create_at: number;
  change_by: string;
  change_at: number;
}

export interface NameDto {
  lang: string;
  value: string;
}