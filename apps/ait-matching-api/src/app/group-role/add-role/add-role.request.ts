import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { EmployeeDto, GetEmployeeDto, GetRoleUserInfoDto } from "./add-role.dto";

@InputType()
export class GetEmployeeRequest extends BaseRequest {
    @Field(() => GetEmployeeDto, { nullable: true })
    condition: GetEmployeeDto;

    @Field(() => [EmployeeDto], { nullable: true })
    data: EmployeeDto[];
}

@InputType()
export class RoleUserInfoRequest extends BaseRequest {
    @Field(() => GetRoleUserInfoDto, { nullable: true })
    condition: GetRoleUserInfoDto;

    @Field(() => [EmployeeDto], { nullable: true })
    data: EmployeeDto[];
}
