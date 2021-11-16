import { BaseDto, KeyValueDto } from "@ait/shared";

export class UserExpInfoErrorsMessage {
    title: string[];
    company_working: string[];
    loacation: string[];
    is_working: string[];
    employee_type: string[];
    start_date_from: string[];
    start_date_to: string[];
    description: string[];
}

export interface UserExperienceDto extends BaseDto {

    title: KeyValueDto,
    company_working: KeyValueDto,
    location: KeyValueDto,
    employee_type: KeyValueDto,
    is_working: boolean,
    start_date_from: string,
    start_date_to: string,
    description: string,
}