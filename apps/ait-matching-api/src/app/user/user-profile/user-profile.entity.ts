import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, KeyValueEntity } from '@ait/core';

@ObjectType()
export class SkillEntity {
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

  @Field(() => String, { nullable: true })
  dob?: string;

  @Field(() => String, { nullable: true })
  katakana?: string;

  @Field(() => String, { nullable: true })
  romaji?: string;

  @Field(() => String, { nullable: true })
  phone_number?: string;

}