import { AitBaseService, AitCtxUser, SysUser } from "@ait/core";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { MasterListRequest } from "./master-list.request";
import { MasterListResponse } from "./master-list.response";


@Resolver()
export class MasterListResolver extends AitBaseService {

    @Query(() => MasterListResponse, { name: 'getAllRecordOfMaster' })
  async getAllRecordOfMaster(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => MasterListRequest }) request: MasterListRequest
  ) {
    const result = await this.find(request, user);
    return result
  }
}