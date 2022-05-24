import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseEntity, KeyValueEntity } from '@ait/core';

@ObjectType()
export class ReorderSkillEntity extends BaseEntity {

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => String, { nullable: true })
  relationship?: string;

  @Field(() => Float, { nullable: true })
  sort_no?: number;
  
  @Field(() => [KeyValueEntity], { nullable: true })
  skills?: [KeyValueEntity];

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  level?: string;
  
  @Field(() => KeyValueEntity, { nullable: true })
  category?: KeyValueEntity;

  @Field(() => [KeyValueEntity], { nullable: true })
  top_skills?: KeyValueEntity[];
}