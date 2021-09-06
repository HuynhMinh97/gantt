import { COLLECTIONS, KEYS, OPERATOR } from '@ait/shared';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RefCondition {
  @Field(() => String, { nullable: true })
  company: string;

  @Field(() => String, { nullable: true })
  class: string;

  @Field(() => String, { nullable: true })
  code: string;

  @Field(() => String, { nullable: true })
  parent_code: string;

  @Field(() => Boolean, { nullable: true })
  active_flag: boolean;
}
@InputType()
export class ConditionDto {
  @Field(() => String, { nullable: true, defaultValue: OPERATOR.IN })
  operator: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  value: string[];

  @Field(() => String, { nullable: true })
  attribute: string;

  @Field(() => String, {
    nullable: true,
    defaultValue: COLLECTIONS.MASTER_DATA,
  })
  ref_collection: string;

  @Field(() => String, { nullable: true })
  ref_attribute: string;

  @Field(() => RefCondition, { nullable: true })
  ref_condition: RefCondition;

  @Field(() => String, { nullable: true })
  return_field: string;

  @Field(() => String, { nullable: true, defaultValue: KEYS.CODE })
  get_by: string;
}
