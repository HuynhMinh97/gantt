import {
  BaseEntity,
  ChangeByDto,
  CreateByDto,
  KeyValueEntity,
} from '@ait/core';
import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CertificateListEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => KeyValueEntity, { nullable: true })
  certificate_name: KeyValueEntity;

  @Field(() => String, { nullable: true })
  certificate_award_number: string;

  @Field(() => String, { nullable: true })
  grade: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => KeyValueEntity, { nullable: true })
  issue_by: KeyValueEntity;

  @Field(() => Float, { nullable: true })
  issue_date_from: number;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

}
