import { BaseDto } from '@ait/core';
import { ConditionDto, CreateByDto, ChangeByDto } from '@ait/core';
import { Field, ID, InputType, Int, Float } from '@nestjs/graphql';

@InputType()
export class MyQueriesDto extends BaseDto {
  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  project_ait_name?: string;

  @Field(() => String, { nullable: true })
  industry?: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  level?: string;

  @Field(() => String, { nullable: true })
  location: string;

  @Field(() => String, { nullable: true })
  skill: string;

  @Field(() => Float, { nullable: true })
  valid_time_from: number;

  @Field(() => Float, { nullable: true })
  valid_time_to: number;

  @Field(() => String, { nullable: true })
  create_by: CreateByDto;

  @Field(() => String, { nullable: true })
  change_by: ChangeByDto;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}

@InputType()
export class SearchMyQueriesDto {
  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => ConditionDto, { nullable: true })
  project_ait_name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  industry?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  title?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  level?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  skill?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  location?: ConditionDto;

  @Field(() => Boolean, { nullable: true })
  del_flag?: boolean;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => ConditionDto, { nullable: true })
  valid_time_from?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  valid_time_to?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_at_from?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_at_to?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_from?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_to?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_by?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_by?: ConditionDto;
}
