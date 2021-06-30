import { KEYS, COLLECTIONS, OPERATOR } from '@ait/shared';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateByDto {
  @Field(() => String, { nullable: true, defaultValue: OPERATOR.IN })
  operator: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  value: string[];

  @Field(() => String, {
    nullable: true,
    defaultValue: KEYS.CREATE_BY,
  })
  attribute: string;

  @Field(() => String, {
    nullable: true,
    defaultValue: COLLECTIONS.USER_PROFILE,
  })
  ref_collection: string;

  @Field(() => String, {
    nullable: true,
    defaultValue: KEYS.USER_ID,
  })
  ref_attribute: string;

  @Field(() => String, {
    nullable: true,
    defaultValue: KEYS.NAME,
  })
  return_field: string;
}
