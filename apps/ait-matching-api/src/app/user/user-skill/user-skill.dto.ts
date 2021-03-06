import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserSkillDto extends BaseDto {

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => Float, { nullable: true })
  sort_no?: number;

  @Field(() => Float, { nullable: true })
  level?: number;

  @Field(() => ConditionDto, { nullable: true })
  skills?: ConditionDto;
}
