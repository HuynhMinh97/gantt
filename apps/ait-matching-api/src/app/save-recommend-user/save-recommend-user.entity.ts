import { BaseEntity } from '@ait/core';
import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class SaveRecommendUserEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  relationship: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  first_name?: string;

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

@ObjectType()
export class SkillForUserEntity extends BaseEntity {
  @Field(() => [String], { nullable: true })
  skills: string[];
}