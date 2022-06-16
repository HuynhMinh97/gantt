import { BaseDto, ConditionDto } from '@ait/core';
import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class BizProjectDto extends BaseDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => ConditionDto, { nullable: true })
  industry?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  title?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  level?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  location?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  skills?: ConditionDto;

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  remark?: string;
}

@InputType()
export class BizProjectSaveDto extends BaseDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => [String], { nullable: true })
  industry?: string[];

  @Field(() => [String], { nullable: true })
  title?: string[];

  @Field(() => [String], { nullable: true })
  level?: string[];

  @Field(() => [String], { nullable: true })
  location?: string[];

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  remark?: string;
}

@InputType()
export class GetProjectInfoDto extends BaseDto {
  @Field(() => [ConditionDto], { nullable: true })
  industry?: ConditionDto[];

  @Field(() => [ConditionDto], { nullable: true })
  title?: ConditionDto[];

  @Field(() => [ConditionDto], { nullable: true })
  level?: ConditionDto[];

  @Field(() => [ConditionDto], { nullable: true })
  location?: ConditionDto[];

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;

  @Field(() => [ConditionDto], { nullable: true })
  skills?: ConditionDto[];
}
@InputType()
export class BizProjectDetailDto extends BaseDto {
  @Field(() => String, { nullable: true })
  project?: string;

  @Field(() => String, { nullable: true })
  project_code?: string;

  @Field(() => String, { nullable: true })
  person_in_charge?: string;

  @Field(() => ConditionDto, { nullable: true })
  customer?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  status?: ConditionDto;
}
