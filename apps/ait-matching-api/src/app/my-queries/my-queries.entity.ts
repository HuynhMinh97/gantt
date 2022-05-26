import { BaseEntity, KeyValueEntity, } from "@ait/core";
import { Field, Float, ID, ObjectType } from "@nestjs/graphql";



@ObjectType()
export class MyQueriesEntity extends BaseEntity{
    @Field(() => ID, { nullable: true })
    _key: string;
    
    @Field(() => String, { nullable: true })
    project_ait_name?: string;
    
    @Field(() => String, { nullable: true })
    skill?: string;
  
    @Field(() => KeyValueEntity, { nullable: true })
    industry?: KeyValueEntity; 

    @Field(() => KeyValueEntity, { nullable: true })
    title?: KeyValueEntity; 

    @Field(() => KeyValueEntity, { nullable: true })
    level?: KeyValueEntity; 

    @Field(() => KeyValueEntity, { nullable: true })
    location?: KeyValueEntity; 

    @Field(() => KeyValueEntity, { nullable: true })
    skills?: KeyValueEntity; 

    @Field(() => Float, { nullable: true })
    valid_time_from?: number;

    @Field(() => Float, { nullable: true })
    valid_time_to?: number;

    @Field(() => Boolean, { nullable: true })
    active_flag?: boolean;
}