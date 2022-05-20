import { BaseDto, ConditionDto, KeyValueEntity } from '@ait/core';
import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { bold } from 'chalk';

@InputType()
export class SaveUserCertificateDto extends BaseDto {
  @Field(() => String, { nullable: true })
  certificate_award_name?: string;

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
@InputType()export class UserCertificateDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  certificate_award_name?: ConditionDto;

  @Field(() => String, { nullable: true })
  certificate_award_number?: string;

  @Field(() => String, { nullable: true })
  grade?: string;

  @Field(() => ConditionDto, { nullable: true })
  issue_by?: ConditionDto;

  @Field(() => Float, { nullable: true })
  issue_date_from?: number;

  @Field(() =>Float, { nullable: true })
  issue_date_to?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  file?: string[];

}