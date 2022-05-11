import { BaseRequest } from "@ait/core";
import { Field, InputType } from "@nestjs/graphql";
import { UserListDto, UserNewDto, UserSearchDto } from "./user-list.dto";
@InputType()
export class UserListRequest extends BaseRequest {
    @Field(() => UserSearchDto, { nullable: true })
    condition: UserSearchDto;

    @Field(() => [UserListDto], { nullable: true })
    data: UserListDto[];
}

@InputType()
export class UserRequest extends BaseRequest {
    @Field(() => UserNewDto, { nullable: true })
    condition: UserNewDto;

    @Field(() => [UserNewDto], { nullable: true })
    data: UserNewDto[];
}
