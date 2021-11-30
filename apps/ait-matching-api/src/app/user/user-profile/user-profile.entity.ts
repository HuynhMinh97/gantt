import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseEntity, KeyValueEntity } from '@ait/core';

@ObjectType()
export class UserProfileEntity extends BaseEntity {

  @Field(() => String, { nullable: true })
  avatar_url?: string;

  @Field(() => String, { nullable: true })
  background_url?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  title?: KeyValueEntity;
  
  @Field(() => KeyValueEntity, { nullable: true })
  company_working?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  province_city?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  country_region?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  introduce?: string;

  @Field(() => [KeyValueEntity], { nullable: true })
  top_skills?: KeyValueEntity[];

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  about?: string;

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => String, { nullable: true })
  relationship?: string;
}