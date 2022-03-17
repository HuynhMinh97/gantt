import { BaseDto } from './base.dto';

export interface UserSettingDto extends BaseDto {
  site_language?: string;
  timezone?: number;
}
