import { Field, InputType, Int } from '@nestjs/graphql';
import { BaseDto } from './base.dto';
import { GraphQLJSONObject } from 'graphql-type-json';
@InputType()
export class SysGroupDto extends BaseDto {
  @Field(() => String, { nullable: true })
  module: string;

  @Field(() => String, { nullable: true })
  page: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => String, { nullable: true })
  collection: string;

  @Field(() => Boolean, { nullable: true })
  active_flag: boolean;

  @Field(() => Int, { nullable: true })
  sort_no: number;
}

@InputType()
export class SysModuleDto extends SysGroupDto {
  @Field(() => String, { nullable: true })
  code: string;
}

@InputType()
export class SysPageDto extends SysModuleDto {
  @Field(() => String, { nullable: true })
  slug: string;

  @Field(() => String, { nullable: true })
  param: string;

  @Field(() => String, { nullable: true })
  type: string;
}

@InputType()
export class ComponentSettingDto {
  @Field(() => String, { nullable: true })
  collection: string;
  
  @Field(() => Int, { nullable: true })
  max_item: number;
  
  @Field(() => String, { nullable: true })
  width: string;

  @Field(() => Boolean, { nullable: true })
  required: boolean;

  @Field(() => Boolean, { nullable: true })
  from_to: boolean;
}

@InputType()
export class SysSearchConditionDto extends BaseDto {
  @Field(() => String, { nullable: true })
  module: string;

  @Field(() => String, { nullable: true })
  page: string;

  @Field(() => String, { nullable: true })
  group: string;

  @Field(() => Int, { nullable: true })
  item_no: number;

  @Field(() => Int, { nullable: true })
  row_no: number;

  @Field(() => Int, { nullable: true })
  col_no: number;

  @Field(() => String, { nullable: true })
  item_id: string;

  @Field(() => String, { nullable: true })
  item_label: string;

  @Field(() => String, { nullable: true })
  item_placeholder: string;

  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => ComponentSettingDto, { nullable: true })
  component_setting: ComponentSettingDto;

  @Field(() => String, { nullable: true })
  validate: string;
}

@InputType()
export class SysSearchResultDto extends SysSearchConditionDto {}

@InputType()
export class SysInputDto extends SysSearchConditionDto {}

@InputType()
export class SaveDataDto extends BaseDto {
  @Field(() => GraphQLJSONObject, { nullable: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}