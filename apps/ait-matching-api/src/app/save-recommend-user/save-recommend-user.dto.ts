import { BaseDto } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SaveRecommendUserDto extends BaseDto {
  @Field(() => String, { nullable: true })
  _from: string;

  @Field(() => String, { nullable: true })
  _to: string;
}

@InputType()
export class SkillForUserDto extends BaseDto {
  @Field(() => String, { nullable: true })
  id: string;
}
