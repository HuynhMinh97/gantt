import { BaseDto, ConditionDto, KeyValueEntity } from '@ait/core';
import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { bold } from 'chalk';

@InputType()
export class SaveUserJobAlertDto extends BaseDto {
  @Field(() => [String], { nullable: true })
  industry?: string[];

  @Field(() => [String], { nullable: true })
  experience_level?: string[];

  @Field(() => [String], { nullable: true })
  employee_type?: string[];

  @Field(() => [String], { nullable: true })
  location?: string[];

  @Field(() => Float, { nullable: true })
  start_date_from?: number;

  @Field(() =>Float, { nullable: true })
  start_date_to?: number;

  @Field(() => Float, { nullable: true })
  salary_from?: number;

  @Field(() => Float, { nullable: true })
  salary_to?: number;

}
@InputType()export class UserJobAlertDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  industry?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  experience_level?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  employee_type?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  location?: ConditionDto;

  @Field(() => Float, { nullable: true })
  start_date_from?: number;

  @Field(() =>Float, { nullable: true })
  start_date_to?: number;

  @Field(() => Float, { nullable: true })
  salary_from?: number;

  @Field(() => Float, { nullable: true })
  salary_to?: number;

}