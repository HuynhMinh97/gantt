import { BaseEntity, KeyValueEntity, } from '@ait/core';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';



@ObjectType()
export class RegisterProjectEntity extends BaseEntity {

    @Field(() => Boolean, { nullable: true })
    active_flag?: boolean;

    @Field(() => ID, { nullable: true })
    _key: string;
  
    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    remark?: string;

    @Field(() => String, { nullable: true })
    project_ait_name?: string;
  
    @Field(() => KeyValueEntity, { nullable: true })
    industry?: KeyValueEntity; 

    @Field(() => KeyValueEntity, { nullable: true })
    title?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    level?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    skills?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    location?: KeyValueEntity;

    @Field(() => Float, { nullable: true })
    valid_time_from?: number;

    @Field(() => Float, { nullable: true })
    valid_time_to?: number;
    
}


