import { OPERATOR } from "@ait/shared";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class ConditionDto {
  @Field(() => String, { nullable: true, defaultValue: OPERATOR.IN })
  operator: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  value: string[];
}
