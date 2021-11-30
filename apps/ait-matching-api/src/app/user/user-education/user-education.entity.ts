import { Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseEntity, KeyValueEntity } from '@ait/core';

@ObjectType()
export class UserEducationInfoEntity extends BaseEntity {
    @Field(() => KeyValueEntity, { nullable: true })
    school?: KeyValueEntity;

    @Field(() => String, { nullable: true })
    degree?: string;

    @Field(() => String, { nullable: true })
    field_of_study?: string;

    @Field(() => String, { nullable: true })
    grade?: string;

    @Field(() => [String], { nullable: true })
    file?: string[];

    @Field(() => Float, { nullable: true })
    start_date_from?: number;

    @Field(() => Float, { nullable: true })
    start_date_to?: number;

    @Field(() => String, { nullable: true })
    description?: string;
}