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