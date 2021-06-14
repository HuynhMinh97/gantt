import { BaseDto } from './base.dto';
import { InputType, Field } from '@nestjs/graphql';
import { ConditionDto } from './condition.dto';
@InputType()
export class UserSettingDto extends BaseDto {
  @Field(() => ConditionDto, { nullable: true })
  date_format_display?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  date_format_input?: ConditionDto;

  @Field(() => String, { nullable: true })
  number_format?: string;

  @Field(() => String, { nullable: true })
  site_language?: string;

  @Field(() => String, { nullable: true })
  timezone?: string;
}
