import { BaseEntity } from './../../../../../../libs/core/src/lib/entities/base.entity';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { KeyValueEntity } from '@ait/core';

@ObjectType()
export class UserOnboardingInfoEntity extends BaseEntity {
    @Field(() => String, { nullable: true })
    first_name?: string;

    @Field(() => String, { nullable: true })
    last_name?: string;

    @Field(() => String, { nullable: true })
    katakana?: string;

    @Field(() => String, { nullable: true })
    romaji?: string;

    @Field(() => KeyValueEntity, { nullable: true })
    gender?: KeyValueEntity;

    @Field(() => Float, { nullable: true })
    bod?: number;

    @Field(() => String, { nullable: true })
    phone_number?: string;

    @Field(() => String, { nullable: true })
    about?: string;

    @Field(() => KeyValueEntity, { nullable: true })
    country_region?: KeyValueEntity;

    @Field(() => String, { nullable: true })
    postcode?: string;

    @Field(() => KeyValueEntity, { nullable: true })
    province_city?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    district?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    ward?: KeyValueEntity;

    @Field(() => String, { nullable: true })
    address?: string;

    @Field(() => String, { nullable: true })
    floor_building?: string;

    @Field(() => KeyValueEntity, { nullable: true })
    company_working?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    title?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    industry?: KeyValueEntity;

}