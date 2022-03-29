import { BaseEntity, KeyValueDto, KeyValueEntity } from "@ait/core";
import { Field, Int, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class GroupRoleListEntity extends BaseEntity {
    @Field(() => String, { nullable: true })
    module?: string;

    @Field(() => String, { nullable: true })
    page?: string;
    
    @Field(() => String, { nullable: true })
    permission?: string;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => String, { nullable: true })
    remark?: string;

    @Field(() => String, { nullable: true })
    child_name?: string;

    @Field(() => String, { nullable: true })
    first_name?: string;
  
    @Field(() => String, { nullable: true })
    last_name?: string;

    @Field(() => String, { nullable: true })
    employee_name?: string;

    @Field(() => String, { nullable: true })
    userId?: string;
}
