import { BaseDto, KeyValueDto } from '@ait/core';
import { ConditionDto } from '@ait/core';
import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CaptionListDto extends BaseDto {
  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => KeyValueDto, { nullable: true })
  module?: KeyValueDto;

  @Field(() => KeyValueDto, { nullable: true })
  page?: KeyValueDto;

  @Field(() => Int, { nullable: true })
  group_no?: number;
}

@InputType()
export class SearchCaptionListDto {
  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => ConditionDto, { nullable: true })
  name?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  code?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  module?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  page?: ConditionDto;

  @Field(() => Boolean, { nullable: true })
  del_flag?: boolean;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => ConditionDto, { nullable: true })
  create_at_from?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_at_to?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_from?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_at_to?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  create_by?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  change_by?: ConditionDto;
}
