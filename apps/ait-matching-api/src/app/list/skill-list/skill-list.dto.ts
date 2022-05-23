import { BaseDto } from '@ait/core';
import {  ConditionDto, CreateByDto,ChangeByDto } from '@ait/core';
import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SkillListDto extends BaseDto  {

  @Field(() => ID, { nullable: true })
  _key: string;
  
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  create_at: number;

  @Field(() => String, { nullable: true })
  change_at: number;

  @Field(() => String, { nullable: true })
  create_by: CreateByDto;

  @Field(() => String, { nullable: true })
  change_by: ChangeByDto;

  @Field(() => Boolean, { nullable: true })
    active_flag?: boolean;
}

@InputType()
export class CategoryDto {
  @Field(() => String, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  value: string;
}

@InputType()
export class SearchSkillListDto {

  @Field(() => ID, { nullable: true })
  _key: string;
  
  @Field(() => ConditionDto, { nullable: true })
  name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  code?: ConditionDto;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => Boolean, { nullable: true })
  del_flag?: boolean;

  @Field(() => Boolean, { nullable: true })
    active_flag?: boolean;

  @Field(() => ConditionDto, { nullable: true })
  category?: ConditionDto;

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
