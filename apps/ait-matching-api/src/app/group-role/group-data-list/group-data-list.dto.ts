import { BaseDto, ChangeByDto, ConditionDto, CreateByDto } from '@ait/core';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GroupDataListDto extends BaseDto {
  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  module?: string;

  @Field(() => String, { nullable: true })
  page?: string;

  @Field(() => String, { nullable: true })
  permission?: string;

  @Field(() => String, { nullable: true })
  create_at: number;

  @Field(() => String, { nullable: true })
  change_at: number;

  @Field(() => String, { nullable: true })
  create_by: CreateByDto;

  @Field(() => String, { nullable: true })
  change_by: ChangeByDto;
}

@InputType()
export class SearchGroupDataListDto {
    @Field(() => Boolean, { nullable: true })
    del_flag?: boolean;

  @Field(() => ConditionDto, { nullable: true })
  name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  employee_name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  permission?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_at_from: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_at_to: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_from: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_to: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_by: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_by: ConditionDto;
}
