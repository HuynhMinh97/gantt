import { AitBaseService, AitCtxUser, SysUser } from "@ait/core";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserListRequest, UserRequest } from "./user-list.request";
import { UserListResponse } from "./user-list.response";

@Resolver()
export class UserListResolver extends AitBaseService {
  @Query(() => UserListResponse, { name: 'getAllUser' })
  async getAllUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserListRequest })
    request: UserListRequest
  ) {
    return this.find(request);
  }

  @Mutation(() => UserListResponse, { name: 'saveNewUser' })
  saveNewUser(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserRequest }) request: UserRequest
  ) {    
    return this.save(request, user);
  }

  // @Mutation(() => SaveRecommendUserResponse, {
  //   name: 'removeSaveRecommendUser',
  // })
  // removeSaveRecommendUser(
  //   @AitCtxUser() user: SysUser,
  //   @Args('request', { type: () => SaveRecommendUserRequest })
  //   request: SaveRecommendUserRequest
  // ) {
  //   const aqlStr = `
  //   FOR u IN sys_user
  //     REMOVE { _key: u._key } IN sys_user
  //     LET removed = OLD
  //   RETURN removed
  //   `;
  //   return this.query(aqlStr);
  // }
}

