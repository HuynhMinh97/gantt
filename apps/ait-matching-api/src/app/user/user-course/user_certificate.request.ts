import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { CourseDto } from './user_certificate.dto';


@InputType()
export class CourseRequest extends BaseRequest {
  @Field(() => CourseDto, { nullable: true })
  condition: CourseDto;

  @Field(() => [CourseDto], { nullable: true })
  data: CourseDto;
}