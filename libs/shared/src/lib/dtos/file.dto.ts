import { BaseDto } from './base.dto';

export interface FileDto extends BaseDto {
  path?: string;
  url?: string;
  name?: string;
  size?: number;
  type?: string;
}