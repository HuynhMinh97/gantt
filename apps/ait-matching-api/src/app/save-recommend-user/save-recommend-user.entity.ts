import { BaseEntity } from '@ait/core';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SaveRecommendUserEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  relationship: string;
}

@ObjectType()
export class SkillForUserEntity extends BaseEntity {
  @Field(() => [String], { nullable: true })
  skills: string[];
}