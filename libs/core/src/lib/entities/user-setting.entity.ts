import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';
import { CodeValueEntity } from './code-value.entity';

@ObjectType()
export class UserSettingEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  date_format_display?: string;

  @Field(() => String, { nullable: true })
  date_format_input?: string;
  
  @Field(() => String, { nullable: true })
  number_format?: string;

  @Field(() => String, { nullable: true })
  site_language?: string;

  @Field(() => String, { nullable: true })
  timezone?: string;
}

@ObjectType()
export class UserSettingCustomEntity extends BaseEntity {
  @Field(() => CodeValueEntity, { nullable: true })
  date_format_display?: CodeValueEntity;

  @Field(() => CodeValueEntity, { nullable: true })
  date_format_input?: CodeValueEntity;
  
  @Field(() => CodeValueEntity, { nullable: true })
  number_format?: CodeValueEntity;

  @Field(() => String, { nullable: true })
  site_language?: string;

  @Field(() => String, { nullable: true })
  timezone?: string;
}
