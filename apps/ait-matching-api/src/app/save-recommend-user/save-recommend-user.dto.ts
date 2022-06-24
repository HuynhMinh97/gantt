import { BaseDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class SaveRecommendUserDto extends BaseDto {
  @Field(() => String, { nullable: true })
  _from: string;

  @Field(() => String, { nullable: true })
  _to: string;

  @Field(() => String, { nullable: true })
  remark: string;

  @Field(() => String, { nullable: true })
  planned: string;

  @Field(() => Float, { nullable: true })
  start_plan: number;

  @Field(() => Float, { nullable: true })
  end_plan: number;

  @Field(() => Float, { nullable: true })
  hour_plan: number;

  @Field(() => Float, { nullable: true })
  manday_plan: number;
  
  @Field(() => Float, { nullable: true })
  manmonth_plan: number;
}

@InputType()
export class SkillForUserDto extends BaseDto {
  @Field(() => String, { nullable: true })
  id: string;
}
