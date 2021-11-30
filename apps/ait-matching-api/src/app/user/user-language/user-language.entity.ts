import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, KeyValueEntity } from '@ait/core';

@ObjectType()
export class UserLanguageInfoEntity extends BaseEntity {
    @Field(() => KeyValueEntity, { nullable: true })
    language?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    proficiency?: KeyValueEntity;
}