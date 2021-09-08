import { BaseDto, ConditionDto, KeyValueEntity } from '@ait/core';
import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { bold } from 'chalk';

@InputType()
export class UserCertificateDto extends BaseDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  certificate?: string;

  @Field(() => String, { nullable: true })
  grade?: string;

  @Field(() => String, { nullable: true })
  issue?: string;

  @Field(() => Float, { nullable: true })
  issueDate?: number;

  @Field(() =>Float, { nullable: true })
  immigration?: number;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  file?: string[];
  
  @Field(() => String, { nullable: true })
  keyName?: string;

  @Field(() => String, { nullable: true })
  id?: string;

}