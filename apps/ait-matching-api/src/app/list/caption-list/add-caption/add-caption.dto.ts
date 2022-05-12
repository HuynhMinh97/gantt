import { BaseDto,  } from '@ait/core';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';


@InputType()
export class CaptionObj {
  @Field(() => String, { nullable: true })
  en_US: string;

  @Field(() => String, { nullable: true })
  ja_JP: string;

  @Field(() => String, { nullable: true })
  vi_VN: string;
}

@InputType()
export class CaptionRegisterDto extends BaseDto {
  @Field(() => CaptionObj, { nullable: true })
  name?: CaptionObj;

  @Field(() => String, { nullable: true })
  module?: string;

  @Field(() => String, { nullable: true })
  page?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;
}

@InputType()
export class CaptionRegisterSaveDto extends BaseDto {
  @Field(() => CaptionObj, { nullable: true })
  name?:CaptionObj;

  @Field(() => String, { nullable: true })
  module?: string;

  @Field(() => String, { nullable: true })
  page?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => Int, { nullable: true })
  group_no?: number;
}
