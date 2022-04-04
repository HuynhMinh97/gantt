import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class SearchConditionDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  skills?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  title?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  location?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  industry?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  level?: ConditionDto;

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;
}

@InputType()
export class SaveSearchConditionDto extends BaseDto {
  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => [String], { nullable: true })
  title?: string[];

  @Field(() => [String], { nullable: true })
  location?: string[];

  @Field(() => [String], { nullable: true })
  industry?: string[];

  @Field(() => [String], { nullable: true })
  level?: string[];

  @Field(() => Float, { nullable: true })
  valid_time_from?: number;

  @Field(() => Float, { nullable: true })
  valid_time_to?: number;
}
