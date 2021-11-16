import { BaseDto, KeyValueDto } from '@ait/shared';

export interface UserCourseDto extends BaseDto {

    name: string,
    is_online: boolean,
    training_center: KeyValueDto,
    course_number: string,
    start_date_from: string,
    start_date_to: string,
    description: string,
    file: string[],

}