import { BaseEntity } from "@ait/core";
import { Field, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class NameObjEntity {
  @Field(() => String, { nullable: true })
  en_US: string;

  @Field(() => String, { nullable: true })
  ja_JP: string;

  @Field(() => String, { nullable: true })
  vi_VN: string;
}
@ObjectType()
export class DataMasterEntity extends BaseEntity {

    @Field(() => Boolean, { nullable: true })
    active_flag?: boolean;   
    
    @Field(() => NameObjEntity, { nullable: true })
    name?: NameObjEntity;
  
    @Field(() => String, { nullable: true })
    collection?: string;

    @Field(() => String, { nullable: true })
    _id?: string;
    
}