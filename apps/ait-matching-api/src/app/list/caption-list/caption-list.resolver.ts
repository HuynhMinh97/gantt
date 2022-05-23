import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CaptionListRequest, CaptionListSearchRequest } from './caption-list.request';
import { CaptionListResponse } from './caption-list.response';

@Resolver()
export class CaptionListResolver extends AitBaseService {
  @Query(() => CaptionListResponse, { name: 'findAllCaption' })
  async findAllCaption(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CaptionListRequest }) request: CaptionListRequest
  ) {
    delete request?.condition?.active_flag;
    return this.find(request, user);
  }

  
  @Query(() => CaptionListResponse, { name: 'searchCaption' })
  async searchCaption(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CaptionListSearchRequest })
    request: CaptionListSearchRequest
  ) {
    delete request?.condition?.active_flag;
    return this.find(request, user);
  }

  @Query(() => CaptionListResponse, { name: 'findPageByKey' })
  async findPageByKey(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CaptionListSearchRequest })
    request: CaptionListSearchRequest
  ) {
    return this.find(request, user);
  }

  @Query(() => CaptionListResponse, { name: 'findModuleByKey' })
  async findModuleByKey(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CaptionListSearchRequest })
    request: CaptionListSearchRequest
  ) {
    return this.find(request, user);
  }
}
