import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseEntity, KeyValueEntity } from '@ait/core';

@ObjectType()
export class UserSkillEntity extends BaseEntity {

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => Float, { nullable: true })
  sort_no?: number;

  @Field(() => Float, { nullable: true })
  level?: number;
  
  @Field(() => KeyValueEntity, { nullable: true })
  skills?: KeyValueEntity;
  
}