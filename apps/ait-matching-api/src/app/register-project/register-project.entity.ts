import { BaseEntity, KeyValueEntity } from '@ait/core';
import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CandidateEntity extends BaseEntity {
  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => Float, { nullable: true })
  start_plan?: number;

  @Field(() => Float, { nullable: true })
  end_plan?: number;

  @Field(() => Float, { nullable: true })
  hours_plan?: number;

  @Field(() => Float, { nullable: true })
  manday_plan?: number;

  @Field(() => Float, { nullable: true })
  manmonth_plan?: number;
}

@ObjectType()
export class RegisterProjectEntity extends BaseEntity {
  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => String, { nullable: true })
  project_ait_name?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  industry?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  title?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  level?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  skills?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  location?: KeyValueEntity;

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;
}
