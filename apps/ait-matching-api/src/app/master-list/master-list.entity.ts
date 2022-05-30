import { BaseEntity, KeyValueEntity } from '@ait/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MasterListEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  _id?: string;

  @Field(() => String, { nullable: true })
  collection?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}
