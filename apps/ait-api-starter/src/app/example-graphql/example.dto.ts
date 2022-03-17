import { BaseDto, LangDto } from '@ait/core';
import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class ExampleDto extends BaseDto {
  @Field(() => String, { nullable: true })
  class?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  parent_code?: string;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => LangDto, { nullable: true })
  name?: LangDto;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}
