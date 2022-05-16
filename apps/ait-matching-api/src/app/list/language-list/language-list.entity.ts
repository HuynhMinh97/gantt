import { BaseEntity, KeyValueEntity } from '@ait/core';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LanguageListEntity extends BaseEntity {
  @Field(() => KeyValueEntity, { nullable: true })
  language: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  proficiency: KeyValueEntity;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;
}
