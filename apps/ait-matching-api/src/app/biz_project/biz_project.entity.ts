import { BaseEntity, KeyValueEntity } from '@ait/core';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BizProjectEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => [KeyValueEntity], { nullable: true })
  industry?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  title?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  level?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  location?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  skills?: KeyValueEntity[];

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  remark?: string;
}


@ObjectType()
export class GetProjectInforEntity extends BaseEntity {
  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  remark?: string;

  @Field(() => String, { nullable: true })
  name?: string;
  

  @Field(() => KeyValueEntity, { nullable: true })
  industry?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  title?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  level?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  location?: KeyValueEntity;

  @Field(() => KeyValueEntity, { nullable: true })
  skills?: KeyValueEntity;

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;
}
@ObjectType()
export class BizProjectDetailEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  project?: string;

  @Field(() => String, { nullable: true })
  project_code?: string;

  @Field(() => String, { nullable: true })
  person_in_charge?: string;

  @Field(() => [KeyValueEntity], { nullable: true })
  customer?: KeyValueEntity[];

  @Field(() => [KeyValueEntity], { nullable: true })
  status?: KeyValueEntity[];
}
