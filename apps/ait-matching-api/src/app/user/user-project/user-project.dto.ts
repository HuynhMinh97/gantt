import { BaseDto, ConditionDto } from '@ait/core';
import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserProjectDto extends BaseDto {
    @Field(() => ConditionDto, { nullable: true })
    skills?: ConditionDto;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Float, { nullable: true })
    start_date_from?: number;

    @Field(() => Float, { nullable: true })
    start_date_to?: number;

    @Field(() => ConditionDto, { nullable: true })
    company_working?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    title?: ConditionDto;

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    responsibility?: string;

    @Field(() => String, { nullable: true })
    achievement?: string;

    @Field(() => String, { nullable: true })
    _from?: string;

    @Field(() => ConditionDto, { nullable: true })
    _to?: ConditionDto;

    @Field(() => String, { nullable: true })
    code?: string;
}
@InputType()
export class SaveUserProjectDto extends BaseDto {
    @Field(() => [String], { nullable: true })
    skills?: string[];

    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Float, { nullable: true })
    start_date_from?: number;

    @Field(() => Float, { nullable: true })
    start_date_to?: number;

    @Field(() => String, { nullable: true })
    company_working?: string;

    @Field(() => String, { nullable: true })
    title?: string;

    @Field(() => String, { nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    responsibility?: string;

    @Field(() => String, { nullable: true })
    achievement?: string;

    @Field(() => String, { nullable: true })
    _from?: string;

    @Field(() => String, { nullable: true })
    _to?: string;

    @Field(() => String, { nullable: true })
    relationship?: string;

    @Field(() => Float, { nullable: true })
    sort_no?: number;

}

