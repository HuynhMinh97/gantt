import { BaseDto, KeyValueDto } from '@ait/shared';
export interface LanguageInfo extends BaseDto {
    language: KeyValueDto;
    proficiency: KeyValueDto;
}
