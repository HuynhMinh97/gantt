import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class SearchConditionDto extends BaseDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => ConditionDto, { nullable: true })
  skills?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  current_job_title?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  province_city?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  industry_working?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  current_job_level?: ConditionDto;

  @Field(() => Float, { nullable: true })
  capacity_time_from?: number;

  @Field(() => Float, { nullable: true })
  capacity_time_to?: number;
}

@InputType()
export class SaveSearchConditionDto extends BaseDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => [String], { nullable: true })
  current_job_title?: string[];

  @Field(() => [String], { nullable: true })
  province_city?: string[];

  @Field(() => [String], { nullable: true })
  industry_working?: string[];

  @Field(() => [String], { nullable: true })
  current_job_level?: string[];

  @Field(() => Float, { nullable: true })
  capacity_time_from?: number;

  @Field(() => Float, { nullable: true })
  capacity_time_to?: number;
}
