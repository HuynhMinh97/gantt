import { BaseDto, KeyValueDto } from '@ait/shared';

export interface UserProjectDto extends BaseDto {
    name: KeyValueDto,
    certificate_award_number: string,
    grade: string,
    issue_by: KeyValueDto,
    issue_date_from: Date,
    issue_date_to: Date,
    description: string,
    file: string[],
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