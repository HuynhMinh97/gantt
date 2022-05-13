import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  SkillRegisterRequest,
  SkillRegisterSaveRequest,
} from './add-skill.request';
import { SkillRegisterResponse } from './add-skill.response';

@Resolver()
export class SkillRegisterResolver extends AitBaseService {
  @Query(() => SkillRegisterResponse, { name: 'findSkillByKey' })
  async findSkillByKey(
    @Args('request', { type: () => SkillRegisterRequest })
    request: SkillRegisterRequest
  ) {
    return this.find(request);
  }

  @Query(() => SkillRegisterResponse, { name: 'getMaxSortno' })
  async getMaxSortno(
    @Args('request', { type: () => SkillRegisterRequest })
    request: SkillRegisterRequest
  ) {
    const result = await this.find(request);
    console.log(result)
    return this.find(request);
  
  }

  @Mutation(() => SkillRegisterResponse, { name: 'saveSkill' })
  saveSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SkillRegisterRequest })
    request: SkillRegisterRequest
  ) {
    return this.save(request);
  }
}
