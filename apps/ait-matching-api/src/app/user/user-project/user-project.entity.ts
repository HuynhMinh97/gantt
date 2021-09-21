import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Int, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class UserProjectEntity extends BaseEntity {
    @Field(() => [KeyValueEntity], { nullable: true })
    skills?: KeyValueEntity[];
    
    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Float, { nullable: true })
    start_date_from?: number;

    @Field(() => Float, { nullable: true })
    start_date_to?: number;

    @Field(() => String, { nullable: true })
    company_working?: string;

    @Field(() => String, { nullable: true })
    title?: string;

    @Field(() => String, { nullable: true })
    description?: string;


    @Field(() => String, { nullable: true })
    responsibility?: string;

    @Field(() => String, { nullable: true })
    achievement?: string;

    @Field(() => String, { nullable: true })
    _from?: string;

    @Field(() => String, { nullable: true })
    _to?: string;
    
}
