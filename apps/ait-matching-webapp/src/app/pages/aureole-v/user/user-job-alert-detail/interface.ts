import { BaseDto, KeyValueDto } from '@ait/shared';

export interface UserJobAlertDto extends BaseDto {
    industry: KeyValueDto[],
    experience_level: KeyValueDto[],
    employee_type: KeyValueDto[],
    location: KeyValueDto[],
    start_date_from: Date,
    start_date_to: Date,
    salary_from: number,
    salary_to: number,
}