import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { EducationListDto, EducationSearchtDto } from "./education-list.dto";

@InputType()
export class EducationListRequest extends BaseRequest {
    @Field(() => EducationSearchtDto, { nullable: true })
    condition: EducationSearchtDto;

    @Field(() => [EducationListDto], { nullable: true })
    data: EducationListDto[];
}
