import { BaseDto } from './base.dto';
import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class UserSettingDto extends BaseDto {
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
