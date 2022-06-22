import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class SearchConditionEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => [KeyValueEntity], { nullable: true })
  skills?: string[];

  @Field(() => [KeyValueEntity], { nullable: true })
  current_job_title?: string[];

  @Field(() => [KeyValueEntity], { nullable: true })
  province_city?: string[];

  @Field(() => [KeyValueEntity], { nullable: true })
  industry_working?: string[];

  @Field(() => [KeyValueEntity], { nullable: true })
  current_job_level?: string[];

  @Field(() => Float, { nullable: true })
  capacity_time_from?: number;

  @Field(() => Float, { nullable: true })
  capacity_time_to?: number;
}
