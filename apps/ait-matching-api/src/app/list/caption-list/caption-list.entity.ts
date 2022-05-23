import { BaseEntity, KeyValueEntity, } from "@ait/core";
import { Field, ID, InputType, Int, ObjectType } from "@nestjs/graphql";



@ObjectType()
export class CaptionListEntity extends BaseEntity{
    @Field(() => ID, { nullable: true })
    _key: string;
    
    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Boolean, { nullable: true })
    active_flag?: boolean;
  
    @Field(() => String, { nullable: true })
    code?: string;
  
    @Field(() => KeyValueEntity, { nullable: true })
    module?: KeyValueEntity; 

    @Field(() => KeyValueEntity, { nullable: true })
    page?: KeyValueEntity;

    @Field(() => Int, { nullable: true })
    group_no?: number;
}