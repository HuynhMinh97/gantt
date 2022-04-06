import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { GroupRoleListDto, SearchGroupRoleListDto } from "./group-role-list.dto";

@InputType()
export class GroupRoleListRequest extends BaseRequest {
    @Field(() => SearchGroupRoleListDto, { nullable: true })
    condition: SearchGroupRoleListDto;

    @Field(() => [GroupRoleListDto], { nullable: true })
    data: GroupRoleListDto[];
}
