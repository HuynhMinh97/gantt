import { BaseEntity } from './../../../../../../libs/core/src/lib/entities/base.entity';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { KeyValueEntity } from '@ait/core';

@ObjectType()
export class  NameEntity {

    @Field(() => String, { nullable: true })
    _key?: string;

    @Field(() => String, { nullable: true })
    en_US?: string;

    @Field(() => String, { nullable: true })
    ja_JP?: string;

    @Field(() => String, { nullable: true })
    vi_VN?: string;
  }

@ObjectType()
export class UserExperienceInfoEntity extends BaseEntity {
    @Field(() => NameEntity, { nullable: true })
    title?: NameEntity;

    @Field(() => NameEntity, { nullable: true })
    company_working?: NameEntity;

    @Field(() => NameEntity, { nullable: true })
    location?: NameEntity;

    @Field(() => Boolean, { nullable: true })
    is_working?: boolean;

    @Field(() => NameEntity, { nullable: true })
    employee_type?: NameEntity;

    @Field(() => Float, { nullable: true })
    start_date_from?: number;

    @Field(() => Float, { nullable: true })
    start_date_to?: number;

    @Field(() => String, { nullable: true })
    description?: string;
}