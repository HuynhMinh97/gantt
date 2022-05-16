import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Field, Float, } from '@nestjs/graphql';


@ObjectType()
export class ProjectListEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  skills?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Float, { nullable: true })
  start_date_from?: number;

  @Field(() => Float, { nullable: true })
  start_date_to?: number;

  @Field(() => KeyValueEntity, { nullable: true })
  company_working?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  title?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  responsibility?: string;

  @Field(() => String, { nullable: true })
  achievement?: string;

  @Field(() => String, { nullable: true })
  code?: string;
  
  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;
}


