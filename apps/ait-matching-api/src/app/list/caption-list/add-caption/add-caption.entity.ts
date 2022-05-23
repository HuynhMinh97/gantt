import { BaseEntity, KeyValueEntity, } from '@ait/core';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CaptionObjEntity {
  @Field(() => String, { nullable: true })
  en_US: string;

  @Field(() => String, { nullable: true })
  ja_JP: string;

  @Field(() => String, { nullable: true })
  vi_VN: string;
}

@ObjectType()
export class CaptionRegisterEntity extends BaseEntity {

    @Field(() => Boolean, { nullable: true })
    active_flag?: boolean;

    @Field(() => ID, { nullable: true })
    _key: string;
    
    @Field(() => CaptionObjEntity, { nullable: true })
    name?: CaptionObjEntity;
  
    @Field(() => String, { nullable: true })
    code?: string;
  
    @Field(() => KeyValueEntity, { nullable: true })
    module?: KeyValueEntity; 

    @Field(() => KeyValueEntity, { nullable: true })
    page?: KeyValueEntity;

    @Field(() => Int, { nullable: true })
    group_no?: number;
    
    
}

@ObjectType()
export class CaptionEntity extends BaseEntity {

    @Field(() => Boolean, { nullable: true })
    active_flag?: boolean;

    @Field(() => ID, { nullable: true })
    _key: string;
    
    @Field(() => CaptionObjEntity, { nullable: true })
    name?: CaptionObjEntity;
  
    @Field(() => String, { nullable: true })
    code?: string;
  
    @Field(() => String, { nullable: true })
    module?: string; 

    @Field(() => String, { nullable: true })
    page?: string;

    @Field(() => Int, { nullable: true })
    group_no?: number;
    
}
