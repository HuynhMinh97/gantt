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
