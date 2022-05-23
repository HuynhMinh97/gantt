import { BaseDto, ConditionDto, LangDto } from '@ait/core';
import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SkillRegisterDto extends BaseDto {

  
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => ConditionDto, { nullable: true })
  category?: ConditionDto;
}

@InputType()
export class SkillRegisterSaveDto extends BaseDto {
  @Field(() => LangDto, { nullable: true })
  name?: LangDto;

  @Field(() => Int, { nullable: true })
  sort_no?: number;

  @Field(() => Boolean, { nullable: true })
  active_flag?: boolean;

  @Field(() => Boolean, { nullable: true })
  is_matching?: boolean;
  
  @Field(() => String, { nullable: true })
  category?: string;
}
