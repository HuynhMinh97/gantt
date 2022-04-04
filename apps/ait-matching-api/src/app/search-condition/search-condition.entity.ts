import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class SearchConditionEntity extends BaseEntity {
  @Field(() => [KeyValueEntity], { nullable: true })
  skills?: string[];

  @Field(() => [KeyValueEntity], { nullable: true })
  title?: string[];

  @Field(() => [KeyValueEntity], { nullable: true })
  location?: string[];

  @Field(() => [KeyValueEntity], { nullable: true })
  industry?: string[];

  @Field(() => [KeyValueEntity], { nullable: true })
  level?: string[];

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;
}
