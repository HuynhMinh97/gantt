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
    return this.find(request);
  
  }

  @Mutation(() => SkillRegisterResponse, { name: 'saveSkillInMSkill' })
  saveSkillInMSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SkillRegisterRequest })
    request: SkillRegisterRequest
  ) {
    return this.save(request);
  }

  @Query(() => SkillRegisterResponse, { name: 'findCategoryByKey' })
  async findCategoryByKey(
    @Args('request', { type: () => SkillRegisterRequest })
    request: SkillRegisterRequest
  ) {
    // const _key =  request.condition?._key;
    // const gql=`
    //   FOR data IN sys_master_data
    //   FILTER data._key == "${_key}"
    //   return data
    // `;
    // return this.query(gql);
    return this.find(request);
  }
  
}
