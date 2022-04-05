import { BaseDto, ConditionDto } from "@ait/core";
import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class GetEmployeeDto extends BaseDto{
    @Field(() => ConditionDto, { nullable: true })
    type: ConditionDto;
}

@InputType()
export class EmployeeDto {
    @Field(() => String, { nullable: true })
    _key?: string;

    @Field(() => String, { nullable: true })
    first_name?: string;
  
    @Field(() => String, { nullable: true })
    last_name?: string;
}

@InputType()
export class RoleUserInfoDto {
    @Field(() => String, { nullable: true })
    _key?: string;

    @Field(() => String, { nullable: true })
    module?: string;

    @Field(() => String, { nullable: true })
    page?: string;

    @Field(() => String, { nullable: true })
    remark?: string;

    @Field(() => [String], { nullable: true })
    permission?: string[];

    @Field(() => String, { nullable: true })
    employee_name?: string;
}
@InputType()
export class GetRoleUserInfoDto extends BaseDto{
    @Field(() => String, { nullable: true })
    roleUser_key: string;

    @Field(() => String, { nullable: true })
    employee_key: string;
}
