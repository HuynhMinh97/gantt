import { BaseEntity, KeyValueEntity, } from '@ait/core';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SkillRegisterEntity extends BaseEntity {

    @Field(() => Boolean, { nullable: true })
    active_flag?: boolean;

    @Field(() => ID, { nullable: true })
    _key: string;
    
    @Field(() => String, { nullable: true })
    name?: string;
  
    @Field(() => String, { nullable: true })
    code?: string;
  
    @Field(() => KeyValueEntity, { nullable: true })
    category?: KeyValueEntity; 

    @Field(() => Int, { nullable: true })
    sort_no?: number;
    
}
