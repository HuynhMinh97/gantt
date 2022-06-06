import { BaseDto, BaseEntity, ChangeByDto, ConditionDto, CreateByDto } from '@ait/core';
import { COLLECTIONS, KEYS } from '@ait/shared';
import { InputType, Field, Float, ID, ObjectType, } from '@nestjs/graphql';
import { OPERATOR } from '../../commons/enums';


@InputType()
export class ProjectListDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  skills?: ConditionDto;

  @Field(() => String, { nullable: true })
  user_id: string;

  @Field(() => String, { nullable: true })
  biz_project_key: string;

  @Field(() => ConditionDto, { nullable: true })
  username: ConditionDto;

  @Field(() => String, { nullable: true })
  project_name?: string;

  @Field(() => Float, { nullable: true })
  start_date_from?: number;

  @Field(() => Float, { nullable: true })
  start_date_to?: number;

  @Field(() => ConditionDto, { nullable: true })
  company_working?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  title?: ConditionDto;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  responsibility?: string;

  @Field(() => String, { nullable: true })
  achievement?: string;

  @Field(() => String, { nullable: true })
  create_at: number;

  @Field(() => String, { nullable: true })
  change_at: number;

  @Field(() => ConditionDto, { nullable: true })
  create_by: CreateByDto;

  @Field(() => ConditionDto, { nullable: true })
  change_by: ChangeByDto;
}
@InputType()
export class SearchProjectDto {
  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => ID, { nullable: true })
  biz_project_key: string;

  @Field(() => Boolean, { nullable: true })
  del_flag: boolean;

  @Field(() => ConditionDto, { nullable: true })
  skills?:ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  emp_name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  username?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  project_name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  start_date_from?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  start_date_to?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  company_working?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  title?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  description?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  responsibility?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  achievement?: ConditionDto;

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

  @Field(() => String, { nullable: true })
  relationship?: string;

  @Field(() => Float, { nullable: true })
  sort_no?: number;
}

