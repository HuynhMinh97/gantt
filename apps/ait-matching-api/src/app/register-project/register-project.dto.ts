import { Float } from '@nestjs/graphql';
import { BaseDto, ConditionDto,  } from '@ait/core';
import { Field, InputType, Int } from '@nestjs/graphql';




@InputType()
export class RegisterProjectDto extends BaseDto {

  @Field(() => ConditionDto, { nullable: true })
  industry?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  title?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  level?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  location?: ConditionDto;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;
  
  @Field(() => Float, { nullable: true })
  valid_time_to?: number;

  @Field(() => [ConditionDto], { nullable: true })
  skills?: ConditionDto[];
}

@InputType()
export class RegisterProjectSaveDto extends BaseDto {
  

  @Field(() => String, { nullable: true })
  industry?: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  level?: string;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;
  
  @Field(() => Float, { nullable: true })
  valid_time_to?: number;

  @Field(() => [String], { nullable: true })
  skills?: string[];
}