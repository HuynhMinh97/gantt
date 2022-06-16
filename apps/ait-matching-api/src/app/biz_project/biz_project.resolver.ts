import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  BizProjectRequest,
  BizProjectDetailRequest,
} from './biz_project.request';
import {
  BizProjectDetailResponse,
  BizProjectResponse,
} from './biz_project.response';

@Resolver()
export class BizProjectResolver extends AitBaseService {
  @Query(() => BizProjectResponse, { name: 'findBizProject' })
  findBizProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    return this.find(request, user);
  }

  @Query(() => BizProjectDetailResponse, { name: 'findBizProjectDetail' })
  findBizProjectDetail(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectDetailRequest })
    request: BizProjectDetailRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => BizProjectResponse, { name: 'saveBizProject' })
  saveBizProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    return this.save(request, user);
  }
}
