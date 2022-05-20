import { BaseDto } from './base.dto';
import { InputType, Int, Field, OmitType } from '@nestjs/graphql';
import { ConditionDto } from './condition.dto';

@InputType()
export class SystemDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  class?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  code?: ConditionDto;

  @Field(() => String, { nullable: true })
  parent_code?: string;

  @Field(() => String, { nullable: true })
  parent_code_external?: string;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => Int, { nullable: true })
  group_no?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  module?: string;

  @Field(() => String, { nullable: true })
  page?: string;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => String, { nullable: true })
  param?: string;

  @Field(() => String, { nullable: true })
  file_max_size?: string;

  @Field(() => String, { nullable: true })
  file_max_upload?: string;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;
}

@InputType()
export class SystemAllLangDto extends BaseDto {
  @Field(() => String, { nullable: true })
  class?: string;

  @Field(() => String, { nullable: true })
  parent_code?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  name_VN?: string;

  @Field(() => String, { nullable: true })
  name_JP?: string;

  @Field(() => String, { nullable: true })
  name_EN?: string;
}

@InputType()
export class SystemMasterDto extends OmitType(BaseDto, ['_key'] as const) {
  @Field(() => ConditionDto, { nullable: true })
  class?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  _key?: ConditionDto;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;
}
