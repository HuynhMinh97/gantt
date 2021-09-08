import { BaseDto, ConditionDto, KeyValueEntity } from '@ait/core';
import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { bold } from 'chalk';

@InputType()
export class CourseDto extends BaseDto {
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

  @Field(() =>Float, { nullable: true })
  start_date_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  file?: string[];


}