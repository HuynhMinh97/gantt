import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity, KeyValueEntity } from '@ait/core';

@ObjectType()
export class SkillEntity {
  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  level: string;
}
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

  @Field(() => [KeyValueEntity], { nullable: true })
  top_skills?: KeyValueEntity[];

  @Field(() => [SkillEntity], { nullable: true })
  skills?: SkillEntity[];

  @Field(() => String, { nullable: true })
  about?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  gender?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  company_working?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  industry_working?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  current_job_title?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  current_job_level?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  province_city?: KeyValueEntity;

  @Field(() => String, { nullable: true })
  dob?: string;

  @Field(() => String, { nullable: true })
  katakana?: string;

  @Field(() => String, { nullable: true })
  romaji?: string;

  @Field(() => String, { nullable: true })
  phone_number?: string;

  @Field(() => Boolean, { nullable: true })
  is_saved?: boolean;

  @Field(() => Boolean, { nullable: true })
  is_team_member?: boolean;
}
