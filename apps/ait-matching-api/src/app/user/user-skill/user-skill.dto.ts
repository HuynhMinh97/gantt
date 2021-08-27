import { BaseDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserSkillDto extends BaseDto {
  @Field(() => String, { nullable: true })
  relationship?: string;

  @Field(() => Float, { nullable: true })
  sort_no?: number;
}
