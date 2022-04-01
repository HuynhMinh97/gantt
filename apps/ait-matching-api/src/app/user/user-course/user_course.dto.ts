import { BaseDto, ConditionDto, KeyValueEntity } from '@ait/core';
import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class SaveCourseDto extends BaseDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Boolean, { nullable: true })
  is_online?: boolean;

  @Field(() => String, { nullable: true })
  training_center?: string;

  @Field(() => String, { nullable: true })
  course_number?: string;

  @Field(() => Float, { nullable: true })
  start_date_from?: number;

  @Field(() => Float, { nullable: true })
  start_date_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  file?: string[];
}
@InputType()
export class CourseDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  name?: ConditionDto;

  @Field(() => Boolean, { nullable: true })
  is_online?: boolean;

  @Field(() => ConditionDto, { nullable: true })
  training_center?: ConditionDto;

  @Field(() => String, { nullable: true })
  course_number?: string;

  @Field(() => Float, { nullable: true })
  start_date_from?: number;

  @Field(() => Float, { nullable: true })
  start_date_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  file?: string[];


}