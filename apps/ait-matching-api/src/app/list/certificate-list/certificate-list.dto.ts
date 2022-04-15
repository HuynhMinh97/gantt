import { BaseDto } from '@ait/core';
import {  ConditionDto, CreateByDto,ChangeByDto } from '@ait/core';
import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CertificateListDto extends BaseDto  {

  @Field(() => String, { nullable: true })
  user_id: string;

  @Field(() => String, { nullable: true })
  username?: string;
  
  @Field(() => String, { nullable: true })
  certificate_name: string;

  @Field(() => String, { nullable: true })
  certificate_award_number: string;

  @Field(() => String, { nullable: true })
  grade: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  issue_by: string;

  @Field(() => String, { nullable: true })
  issue_date_from: number;

  @Field(() => String, { nullable: true })
  create_at: number;

  @Field(() => String, { nullable: true })
  change_at: number;

  @Field(() => String, { nullable: true })
  create_by: CreateByDto;

  @Field(() => String, { nullable: true })
  change_by: ChangeByDto;
}

@InputType()
export class CertificateSearchDto {

  @Field(() => Boolean, { nullable: true })
  del_flag: boolean;
  
  @Field(() => ConditionDto, { nullable: true })
  employee_name?: ConditionDto;
  
  @Field(() => ConditionDto, { nullable: true })
  name: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  certificate_award_number: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  grade: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  description: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  issue_by: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  issue_date_from: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  issue_date_to: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_at_from: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_at_to: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_from: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_to: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_by: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_by: ConditionDto;
}
