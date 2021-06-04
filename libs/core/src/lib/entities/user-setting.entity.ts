import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from './base.entity';

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
