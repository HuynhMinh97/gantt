import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserOnboardingInfoDto extends BaseDto {
    @Field(() => String, { nullable: true })
    first_name?: string;

    @Field(() => String, { nullable: true })
    last_name?: string;

    @Field(() => String, { nullable: true })
    katakana?: string;

    @Field(() => String, { nullable: true })
    romaji?: string;

    @Field(() => ConditionDto, { nullable: true })
    gender?: ConditionDto;

    @Field(() => Float, { nullable: true })
    bod?: number;

    @Field(() => String, { nullable: true })
    phone_number?: string;

    @Field(() => String, { nullable: true })
    about?: string;

    @Field(() => ConditionDto, { nullable: true })
    country_region?: ConditionDto;

    @Field(() => String, { nullable: true })
    postcode?: string;

    @Field(() => ConditionDto, { nullable: true })
    province_city?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    district?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    ward?: ConditionDto;

    @Field(() => String, { nullable: true })
    address?: string;

    @Field(() => String, { nullable: true })
    floor_building?: string;

    @Field(() => ConditionDto, { nullable: true })
    company_working?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    current_job_title?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    job_setting_title?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    industry?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    industry_working?: ConditionDto;

    @Field(() => String, { nullable: true })
    code?: string;

}

@InputType()
export class SaveUserOnboardingInfoDto extends BaseDto {
    @Field(() => String, { nullable: true })
    first_name?: string;

    @Field(() => String, { nullable: true })
    last_name?: string;

    @Field(() => String, { nullable: true })
    katakana?: string;

    @Field(() => String, { nullable: true })
    romaji?: string;

    @Field(() => String, { nullable: true })
    gender?: string;

    @Field(() => Float, { nullable: true })
    bod?: number;

    @Field(() => String, { nullable: true })
    phone_number?: string;

    @Field(() => String, { nullable: true })
    about?: string;

    @Field(() => String, { nullable: true })
    country_region?: string;

    @Field(() => String, { nullable: true })
    postcode?: string;

    @Field(() => String, { nullable: true })
    province_city?: string;

    @Field(() => String, { nullable: true })
    district?: string;

    @Field(() => String, { nullable: true })
    ward?: string;

    @Field(() => String, { nullable: true })
    address?: string;

    @Field(() => String, { nullable: true })
    floor_building?: string;

    @Field(() => String, { nullable: true })
    company_working?: string;

    @Field(() => String, { nullable: true })
    current_job_title?: string;

    @Field(() => String, { nullable: true })
    job_setting_title?: string;

    @Field(() => String, { nullable: true })
    industry?: string;

    @Field(() => String, { nullable: true })
    industry_working?: string;

    @Field(() => [String], { nullable: true })
    top_skills?: string[];


}