import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkillListRequest, SkillListSearchRequest } from './skill-list.request';
import { SkillListResponse } from './skill-list.response';

@Resolver()
export class SkillListResolver extends AitBaseService {
  @Query(() => SkillListResponse, { name: 'findAllSkill' })
  async findAllSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SkillListRequest }) request: SkillListRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => SkillListResponse, { name: 'removeSkillByKey' })
  removeSkillByKey(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SkillListRequest }) request: SkillListRequest
  ) {
    return this.remove(request, user);
  }

  @Query(() => SkillListResponse, { name: 'searchSkill' })
  async searchSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SkillListSearchRequest })
    request: SkillListSearchRequest
  ) {
    return this.find(request, user);
  }
}
