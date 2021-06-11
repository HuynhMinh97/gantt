import { OPERATOR } from "@ait/shared";
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class ConditionDto {
  @Field(() => String, { nullable: true, defaultValue: OPERATOR.IN })
  operator: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  value: string[];

  @Field(() => String, { nullable: true })
  attribute: string;

  @Field(() => String, { nullable: true })
  ref_collection: string;

  @Field(() => String, { nullable: true })
  ref_attribute: string;
}
