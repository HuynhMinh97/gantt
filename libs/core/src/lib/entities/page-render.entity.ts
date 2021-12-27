import { GraphQLJSONObject } from 'graphql-type-json';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';

@ObjectType()
export class ButtonEntity {
  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => String, { nullable: true })
  text: string;

  @Field(() => String, { nullable: true })
  icon: string;

  @Field(() => String, { nullable: true })
  tooltip: string;
}

@ObjectType()
export class RouterEntity {
  @Field(() => String, { nullable: true })
  search: string;

  @Field(() => String, { nullable: true })
  input: string;

  @Field(() => String, { nullable: true })
  view: string;
}

@ObjectType()
export class SysGroupEntity extends BaseEntity {
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

@ObjectType()
export class SysModuleEntity extends SysGroupEntity {
  @Field(() => String, { nullable: true })
  code: string;
}

@ObjectType()
export class SysPageEntity extends SysGroupEntity {
  @Field(() => String, { nullable: true })
  slug: string;
  
  @Field(() => String, { nullable: true })
  param: string;
  
  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => RouterEntity, { nullable: true })
  router: RouterEntity;

  @Field(() => [ButtonEntity], { nullable: true })
  button: ButtonEntity[];
}

@ObjectType()
export class ComponentSettingEntity {
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

  @Field(() => Boolean, { nullable: true })
  is_multi_language: boolean;
}

@ObjectType()
export class SearchSettingEntity {
  @Field(() => String, { nullable: true })
  operator: string;

  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => String, { nullable: true })
  attribute: string;

  @Field(() => String, { nullable: true })
  ref_collection: string;

  @Field(() => String, { nullable: true })
  ref_attribute: string;

  @Field(() => String, { nullable: true })
  get_by: string;
}

@ObjectType()
export class SysSearchConditionEntity extends BaseEntity {
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

  @Field(() => ComponentSettingEntity, { nullable: true })
  component_setting: ComponentSettingEntity;

  @Field(() => SearchSettingEntity, { nullable: true })
  search_setting: SearchSettingEntity;


  @Field(() => String, { nullable: true })
  validate: string;
}

@ObjectType()
export class PaperEntity {
  @Field(() => Boolean, { nullable: true })
  display: boolean;

  @Field(() => Int, { nullable: true })
  per_page: number;
}

@ObjectType()
export class SettingEntity {
  @Field(() => String, { nullable: true })
  no_data_message: string;

  @Field(() => String, { nullable: true })
  filter_message: string;

  @Field(() => String, { nullable: true })
  select_mode: string;
  
  @Field(() => PaperEntity, { nullable: true })
  paper: PaperEntity;
}

@ObjectType()
export class ActionEntity {
  @Field(() => String, { nullable: true })
  view: string;

  @Field(() => String, { nullable: true })
  copy: string;

  @Field(() => String, { nullable: true })
  edit: string;

  @Field(() => String, { nullable: true })
  delete: string;
}

@ObjectType()
export class StyleEntity {
  @Field(() => Int, { nullable: true })
  width: number;
}

@ObjectType()
export class ColumnEntity {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  title: string;

  @Field(() => String, { nullable: true })
  type: string;

  @Field(() => String, { nullable: true })
  attribute: string;

  @Field(() => String, { nullable: true })
  ref_collection: string;

  @Field(() => String, { nullable: true })
  ref_attribute: string;

  @Field(() => Boolean, { nullable: true })
  is_multi_language: boolean;

  @Field(() => StyleEntity, { nullable: true })
  style: StyleEntity;
}

@ObjectType()
export class SysSearchResultEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  module: string;

  @Field(() => String, { nullable: true })
  page: string;

  @Field(() => String, { nullable: true })
  group: string;

  @Field(() => String, { nullable: true })
  item_id: string;

  @Field(() => String, { nullable: true })
  collection: string;

  @Field(() => SettingEntity, { nullable: true })
  settings: SettingEntity;

  @Field(() => ActionEntity, { nullable: true })
  actions: ActionEntity;

  @Field(() => [ColumnEntity], { nullable: true })
  columns: ColumnEntity[];
}

@ObjectType()
export class SysInputEntity extends SysSearchConditionEntity {}

@ObjectType()
export class SaveDataEntity extends BaseEntity {
  @Field(() => GraphQLJSONObject, { nullable: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

@ObjectType()
export class StringDataEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  data: string;
}