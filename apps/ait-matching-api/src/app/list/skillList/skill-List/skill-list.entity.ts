import { BaseEntity, KeyValueEntity, } from "@ait/core";
import { Field, ID, InputType, Int, ObjectType } from "@nestjs/graphql";


@InputType()
export class CategoryDto {
  @Field(() => String, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  value: string;
}
@ObjectType()
export class SkillListEntity extends BaseEntity{
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