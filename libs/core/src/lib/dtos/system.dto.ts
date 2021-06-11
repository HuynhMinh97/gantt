import { BaseDto } from './base.dto';
import { InputType, Int, Field } from '@nestjs/graphql';
import { ConditionDto } from './condition.dto';

@InputType()
export class SystemDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  class?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  code?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  parent_code?: ConditionDto;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => Int, { nullable: true })
  group_no?: number;

  @Field(() => ConditionDto, { nullable: true })
  name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  type?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  module?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  page?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  message?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  slug?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  param?: ConditionDto;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}
