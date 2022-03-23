import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { EmployeeDto, GetEmployeeDto } from "./getEmployee.dto";

@InputType()
export class GetEmployeeRequest extends BaseRequest {
    @Field(() => GetEmployeeDto, { nullable: true })
    condition: GetEmployeeDto;

    @Field(() => [EmployeeDto], { nullable: true })
    data: EmployeeDto[];
}
