import { BaseDto, ChangeByDto, ConditionDto, CreateByDto } from '@ait/core';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LanguageListDto extends BaseDto {
  @Field(() => String, { nullable: true })
  language: string;

  @Field(() => String, { nullable: true })
  proficiency: string;

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
export class LanguageSearchDto {

    @Field(() => Boolean, { nullable: true })
    del_flag: boolean;

  @Field(() => ConditionDto, { nullable: true })
  employee_name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  language: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  proficiency: ConditionDto;

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
