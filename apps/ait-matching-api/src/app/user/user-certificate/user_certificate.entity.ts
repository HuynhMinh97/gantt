import { BaseEntity, KeyValueEntity } from '@ait/core';
import { ObjectType, Int, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class UserCertificateEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  certificate_award_number?: string;

  @Field(() => String, { nullable: true })
  grade?: string;

  @Field(() => String, { nullable: true })
  issue_by?: string;

  @Field(() => Float, { nullable: true })
  issue_date_from?: number;

  @Field(() =>Float, { nullable: true })
  issue_date_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  file?: string[];

}
