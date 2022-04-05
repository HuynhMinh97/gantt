import { BaseEntity, KeyValueEntity } from "@ait/core";
import { Field, Int, ObjectType } from "@nestjs/graphql";


@ObjectType()
export class EmployeeEntity extends BaseEntity {
    @Field(() => Int, { nullable: true })
    type?: number;

    @Field(() => String, { nullable: true })
    first_name?: string;
  
    @Field(() => String, { nullable: true })
    last_name?: string;

    @Field(() => String, { nullable: true })
    full_name?: string;
}
@ObjectType()
export class RoleUserInfoEntity extends BaseEntity {
    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => String, { nullable: true })
    role_key?: string;

    @Field(() => String, { nullable: true })
    group_name?: string;

    @Field(() => KeyValueEntity, { nullable: true })
    module?: KeyValueEntity;

    @Field(() => KeyValueEntity, { nullable: true })
    page?: KeyValueEntity;

    @Field(() => String, { nullable: true })
    remark?: string;

    @Field(() => [KeyValueEntity], { nullable: true })
    permission?: KeyValueEntity[];

    @Field(() => KeyValueEntity, { nullable: true })
    employee_name?: KeyValueEntity;
  
}

