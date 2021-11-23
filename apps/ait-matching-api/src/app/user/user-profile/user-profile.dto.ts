import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserProfileDto extends BaseDto {
  @Field(() => String, { nullable: true })
  avatar_url?: string;

  @Field(() => String, { nullable: true })
  background_url?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => ConditionDto, { nullable: true })
  title?: ConditionDto;
  
  @Field(() => ConditionDto, { nullable: true })
  company_working?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  province_city?: ConditionDto;

  @Field(() => ConditionDto, { nullable: true })
  country_region?: ConditionDto;

  @Field(() => String, { nullable: true })
  introduce?: string;

  @Field(() => ConditionDto, { nullable: true })
  top_skills?: ConditionDto; 

  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  name?: string;
  
  @Field(() => String, { nullable: true })
  about?: string;

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => String, { nullable: true })
  relationship?: string;
}


@InputType()
export class SaveUserProfileDto extends BaseDto {
  @Field(() => String, { nullable: true })
  avatar_url?: string;

  @Field(() => String, { nullable: true })
  background_url?: string;

  @Field(() => String, { nullable: true })
  last_name?: string;

  @Field(() => String, { nullable: true })
  first_name?: string;

  @Field(() => String, { nullable: true })
  title?: string;
  
  @Field(() => String, { nullable: true })
  company_working?: string;

  @Field(() => String, { nullable: true })
  province_city?: string;

  @Field(() => String, { nullable: true })
  country_region?: string;

  @Field(() => String, { nullable: true })
  introduce?: string;

  @Field(() => String, { nullable: true })
  _from?: string;

  @Field(() => String, { nullable: true })
  _to?: string;

  @Field(() => String, { nullable: true })
  relationship?: string;
}
