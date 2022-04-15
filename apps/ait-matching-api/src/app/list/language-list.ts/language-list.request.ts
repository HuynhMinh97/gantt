import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { LanguageListDto, LanguageSearchDto } from "./language-list.dto";


@InputType()
export class LanguageListRequest extends BaseRequest {
    @Field(() => LanguageSearchDto, { nullable: true })
    condition: LanguageSearchDto;

    @Field(() => [LanguageListDto], { nullable: true })
    data: LanguageListDto[];
}