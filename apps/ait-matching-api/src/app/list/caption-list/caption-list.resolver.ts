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
    return this.find(request, user);
  }

  
  @Query(() => CaptionListResponse, { name: 'searchCaption' })
  async searchCaption(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => CaptionListSearchRequest })
    request: CaptionListSearchRequest
  ) {
    console.log(this.find(request, user))
    return this.find(request, user);
  }
}
