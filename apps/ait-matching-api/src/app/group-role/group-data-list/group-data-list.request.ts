import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { GroupDataListDto, SearchGroupDataListDto } from "./group-data-list.dto";

@InputType()
export class GroupDataListRequest extends BaseRequest {
    @Field(() => SearchGroupDataListDto, { nullable: true })
    condition: SearchGroupDataListDto;

    @Field(() => [GroupDataListDto], { nullable: true })
    data: GroupDataListDto[];
}
