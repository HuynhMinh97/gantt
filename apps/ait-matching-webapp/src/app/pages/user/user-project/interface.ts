import { BaseDto, KeyValueDto } from '@ait/shared';

export interface UserProjectDto extends BaseDto {
    name: string,
    start_date_from: number,
    start_date_to: number,
    company_working: KeyValueDto,
    title: KeyValueDto,
    description: string,
    skills: KeyValueDto[],
    responsibility: string,
    achievement: string
};
export class UserProjectErrorsMessage {
    name: string[];
    start_date_from: string[];
    start_date_to: string[];
    company_working: string[];
    title: string[];
    description: string[];
    skills: string[];
    responsibility: string[];
    achievement: string[];
}