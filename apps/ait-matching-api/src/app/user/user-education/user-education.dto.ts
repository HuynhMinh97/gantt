import { BaseDto, ConditionDto} from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserEducationInfoDto extends BaseDto {
    @Field(() => ConditionDto, { nullable: true })
    school?: ConditionDto;

    @Field(() => String, { nullable: true })
    degree?: string;

    @Field(() => String, { nullable: true })
    field_of_study?: string;

    @Field(() => String, { nullable: true })
    grade?: string;

    @Field(() => Float, { nullable: true })
    start_date_from?: number;

    @Field(() => Float, { nullable: true })
    start_date_to?: number;

    @Field(() => [String], { nullable: true })
    file?: string[];

    @Field(() => String, { nullable: true })
    description?: string;
}

@InputType()
export class SaveUserEducationInfoDto extends BaseDto {
    @Field(() => String, { nullable: true })
    school?: string;

    @Field(() => String, { nullable: true })
    degree?: string;

    @Field(() => String, { nullable: true })
    field_of_study?: string;

    @Field(() => String, { nullable: true })
    grade?: string;

    @Field(() => Float, { nullable: true })
    start_date_from?: number;

    @Field(() => Float, { nullable: true })
    start_date_to?: number;

    @Field(() => [String], { nullable: true })
    file?: string[];

    @Field(() => String, { nullable: true })
    description?: string;
}