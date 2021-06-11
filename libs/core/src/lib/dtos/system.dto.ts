import { BaseDto } from './base.dto';
import { InputType, Int, Field } from '@nestjs/graphql';
import { ConditionDto } from './condition.dto';

@InputType()
export class SystemDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  class?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  code?: ConditionDto;

  @Field(() => String, { nullable: true })
  parent_code?: string;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => Int, { nullable: true })
  group_no?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  module?: string;

  @Field(() => String, { nullable: true })
  page?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => String, { nullable: true })
  param?: string;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}
