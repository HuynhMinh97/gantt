import { BaseEntity, LangEntity } from '@ait/core';
import { ObjectType, Int, Field } from '@nestjs/graphql';

@ObjectType()
export class ExampleEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  class?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  parent_code?: string;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => LangEntity, { nullable: true })
  name?: LangEntity;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}
