import { Float } from '@nestjs/graphql';
import { BaseDto, ConditionDto } from '@ait/core';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class RegisterProjectDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  industry?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  title?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  level?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  location?: ConditionDto;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => String, { nullable: true })
  project_ait_name?: string;

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;

  @Field(() => [ConditionDto], { nullable: true })
  skills?: ConditionDto[];
}

@InputType()
export class RegisterProjectSaveDto extends BaseDto {
  @Field(() => String, { nullable: true })
  industry?: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  level?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => String, { nullable: true })
  project_ait_name?: string;
}

@InputType()
export class CandidateDto extends BaseDto {
  @Field(() => String, { nullable: true })
  employee_name?: string;

  @Field(() => Float, { nullable: true })
  start_plan?: number;

  @Field(() => Float, { nullable: true })
  end_plan?: number;

  @Field(() => Float, { nullable: true })
  hours_plan?: number;

  @Field(() => Float, { nullable: true })
  manday_plan?: number;
  
  @Field(() => Float, { nullable: true })
  manmonth_plan?: number;

  @Field(() => String, { nullable: true })
  remark?: string;
}
