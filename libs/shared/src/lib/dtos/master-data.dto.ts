import { BaseDto, NameDto } from './base.dto';

export interface MasterDataDto extends BaseDto {
  class: string;
  parent_code: string;
  name: NameDto[];
}
