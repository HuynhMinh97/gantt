import { ConditionDto } from './../../../../../../libs/core/src/lib/dtos/condition.dto';
import { BaseDto, ChangeByDto, CreateByDto } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class EducationListDto extends BaseDto  {

  @Field(() => String, { nullable: true })
  user_id: string;

  @Field(() => String, { nullable: true })
  degree: string;

  @Field(() => String, { nullable: true })
  field_of_study: string;

  @Field(() => String, { nullable: true })
  grade: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  start_date: number;

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
export class EducationSearchtDto {
  
    @Field(() => Boolean, { nullable: true })
  del_flag: boolean;

  @Field(() => ConditionDto, { nullable: true })
  school: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  employee_name: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  degree: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  field_of_study: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  grade: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  description: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  start_date_from: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  start_date_to: ConditionDto;

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
  change_by: ChangeByDto;
}