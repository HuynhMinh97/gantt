import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';
import { LangEntity } from './lang.entity';

@ObjectType()
export class SysEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  class?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  parent_code?: string;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => Int, { nullable: true })
  group_no?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  module?: string;

  @Field(() => String, { nullable: true })
  page?: string;

  @Field(() => LangEntity, { nullable: true })
  message?: LangEntity;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => String, { nullable: true })
  param?: string;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => Boolean, { nullable: true })
  isMatching?: boolean;
}
