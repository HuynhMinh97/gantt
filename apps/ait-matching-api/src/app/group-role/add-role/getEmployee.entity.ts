import { BaseEntity } from "@ait/core";
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
