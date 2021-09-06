import { BaseDto, KeyValueDto } from "@ait/shared";


export interface UserEducationDto extends BaseDto{

    school: KeyValueDto,
    degree: string,
    field_of_study: string,
    grade: string,
    file: string[],
    start_date_from: string,
    start_date_to: string,
    description: string,
  }