import { BaseEntity } from './../../../../../../libs/core/src/lib/entities/base.entity';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { KeyValueEntity } from '@ait/core';

@ObjectType()
export class UserLanguageInfoEntity extends BaseEntity {
    @Field(() => KeyValueEntity, { nullable: true })
    language?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    proficiency?: KeyValueEntity;
}