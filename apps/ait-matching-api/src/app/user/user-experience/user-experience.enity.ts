import { BaseEntity } from './../../../../../../libs/core/src/lib/entities/base.entity';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { KeyValueEntity } from '@ait/core';

@ObjectType()
export class UserExperienceInfoEntity extends BaseEntity {
    @Field(() => KeyValueEntity, { nullable: true })
    title?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    company_working?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    location?: KeyValueEntity;

    @Field(() => Boolean, { nullable: true })
    is_working?: boolean;

    @Field(() => KeyValueEntity, { nullable: true })
    employee_type?: KeyValueEntity;

    @Field(() => Float, { nullable: true })
    start_date_from?: number;

    @Field(() => Float, { nullable: true })
    start_date_to?: number;

    @Field(() => String, { nullable: true })
    description?: string;
}