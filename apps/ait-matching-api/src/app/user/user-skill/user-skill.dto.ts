import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserSkillDto extends BaseDto {

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => String, { nullable: true })
  relationship?: string;

  @Field(() => Float, { nullable: true })
  sort_no?: number;
}
