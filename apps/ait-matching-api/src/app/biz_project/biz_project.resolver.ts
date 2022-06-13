import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BizProjectRequest } from './biz_project.request';
import { BizProjectResponse } from './biz_project.response';

@Resolver()
export class BizProjectResolver extends AitBaseService {
  @Mutation(() => BizProjectResponse, { name: 'saveBizProject' })
  saveBizProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => BizProjectRequest })
    request: BizProjectRequest
  ) {
    return this.save(request, user);
  }
}
