import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { CourseDto, SaveCourseDto } from './user_certificate.dto';


@InputType()
export class CourseRequest extends BaseRequest {
  @Field(() => CourseDto, { nullable: true })
  condition: CourseDto;

  @Field(() => [SaveCourseDto], { nullable: true })
  data: CourseDto;
}