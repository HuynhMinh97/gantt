import { BaseDto, ConditionDto} from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserExperienceInfoDto extends BaseDto {
    @Field(() => ConditionDto, { nullable: true })
    title?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    company_working?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    location?: ConditionDto;

    @Field(() => Boolean, { nullable: true })
    is_working?: boolean;

    @Field(() => ConditionDto, { nullable: true })
    employee_type?: ConditionDto;

    @Field(() => Float, { nullable: true })
    start_date_from?: number;

    @Field(() => Float, { nullable: true })
    start_date_to?: number;

    @Field(() => String, { nullable: true })
    description?: string;
}