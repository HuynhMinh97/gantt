import { BaseDto, ConditionDto} from '@ait/core';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UserLanguageInfoDto extends BaseDto {
    @Field(() => ConditionDto, { nullable: true })
    language?: ConditionDto;

    @Field(() => ConditionDto, { nullable: true })
    proficiency?: ConditionDto;
}

@InputType()
export class SaveUserLanguageInfoDto extends BaseDto {
    @Field(() => String, { nullable: true })
    language?: string;

    @Field(() => String, { nullable: true })
    proficiency?: string;
}