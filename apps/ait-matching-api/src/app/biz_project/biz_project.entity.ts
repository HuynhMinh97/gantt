import { BaseEntity, KeyValueEntity } from '@ait/core';
import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BizProjectEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => [KeyValueEntity], { nullable: true })
  industry?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  title?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  level?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  location?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  skills?: KeyValueEntity[];

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  remark?: string;
}
