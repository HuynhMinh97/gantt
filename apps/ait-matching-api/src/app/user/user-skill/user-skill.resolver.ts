import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserSkillRequest } from './user-skill.request';
import { UserSkillResponse } from './user-skill.response';

@Resolver()
export class UserSkillResolver extends AitBaseService {
  collection = 'user_skill';

  @Query(() => UserSkillResponse, { name: 'findUserSkill' })
  findUserSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest) {
    return this.find(request, user);
  }

  @Mutation(() => UserSkillResponse, { name: 'saveUserSkill' })
  saveUserSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  ) {    
    return this.save(request, user);
  }

  @Mutation(() => UserSkillResponse, { name: 'removeUserSkill' })
  removeUserSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  ) {    
    return this.remove(request, user);
  }
}