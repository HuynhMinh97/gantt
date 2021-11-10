import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Int, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class UserJobAlertEntity extends BaseEntity {

  @Field(() => [KeyValueEntity], { nullable: true })
  industry?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  experience_level?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  employee_type?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  location?: KeyValueEntity[];

  @Field(() => Float, { nullable: true })
  start_date_from?: number;

  @Field(() =>Float, { nullable: true })
  start_date_to?: number;

  @Field(() => Float, { nullable: true })
  salary_from?: number;

  @Field(() => Float, { nullable: true })
  salary_to?: number;
}
