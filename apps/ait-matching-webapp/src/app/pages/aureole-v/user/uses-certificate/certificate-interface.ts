import { BaseDto, KeyValueDto } from '@ait/shared';

export interface UserProjectDto extends BaseDto {
    name: string,
    certificate_award_number: number,
    grade: number,
    issue_by: string,
    issue_date_from: string,
    issue_date_to: string,
    description: KeyValueDto[],
    file: string,
};
export class UserProjectErrorsMessage {
    name: string[];
    start_date_from: string[];
    start_date_to: string[];
    company: string[];
    title: string[];
    description: string[];
    skills: string[];
    responsibility: string[];
    achievement: string[];
}