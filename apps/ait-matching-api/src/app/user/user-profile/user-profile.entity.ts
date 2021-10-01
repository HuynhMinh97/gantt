import { BaseEntity } from '../../../../../../libs/core/src/lib/entities/base.entity';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { KeyValueEntity } from '@ait/core';

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

  @Field(() => String, { nullable: true })
  title?: string;
  
  @Field(() => String, { nullable: true })
  company_working?: string;

  @Field(() => String, { nullable: true })
  province_city?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  introduce?: string;

  @Field(() => [KeyValueEntity], { nullable: true })
  top_skills?: KeyValueEntity[];

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  name?: string;
}