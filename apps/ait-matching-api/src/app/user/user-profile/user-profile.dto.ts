import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UserProfileDto extends BaseDto {
  @Field(() => String, { nullable: true })
  project_id?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => ConditionDto, { nullable: true })
  top_skills?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  gender?: ConditionDto;

  @Field(() => Number, { nullable: true })
  dob?: number;

  @Field(() => String, { nullable: true })
  phone_number?: string;

  @Field(() => String, { nullable: true })
  about?: string;

  @Field(() => [String], { nullable: true })
  list?: string[];

  @Field(() => ConditionDto, { nullable: true })
  company_working?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  province_city?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  industry_working?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  current_job_title?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  current_job_level?: ConditionDto;

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => String, { nullable: true })
  relationship?: string;

  @Field(() => Int, { nullable: true })
  start?: number;

  @Field(() => Int, { nullable: true })
  end?: number;

  @Field(() => Boolean, { nullable: true })
  is_saved?: boolean;

  @Field(() => Boolean, { nullable: true })
  is_team_member?: boolean;
}

@InputType()
export class SaveUserProfileDto extends BaseDto {
  @Field(() => String, { nullable: true })
  avatar_url?: string;

  @Field(() => String, { nullable: true })
  background_url?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  company_working?: string;

  @Field(() => String, { nullable: true })
  province_city?: string;

  @Field(() => String, { nullable: true })
  country_region?: string;

  @Field(() => String, { nullable: true })
  introduce?: string;

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => String, { nullable: true })
  relationship?: string;
}
