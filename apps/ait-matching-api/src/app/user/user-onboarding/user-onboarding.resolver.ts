/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, KeyValueEntity, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import {
  CurrentJobSkillsResponse,
  UserOnboardingInfoResponse,
} from './user-onboarding.response';
import {
  UserJobSettingRequest,
  UserOnboardingInfoRequest,
} from './user-onboarding.request';
import { CurrentJobSkillsEntity } from './user-onboarding.entity';
import { UserSkillResponse } from '../user-skill/user-skill.response';
import { UserSkillRequest } from '../user-skill/user-skill.request';
import { RESULT_STATUS } from '@ait/shared';

@Resolver()
export class UserOnboardingInfoResolver extends AitBaseService {
  collection = 'user_profile';

  @Query(() => UserOnboardingInfoResponse, { name: 'findUserOnboardingInfo' })
  async findUserOnboardingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest })
    request: UserOnboardingInfoRequest
  ) {
    const data = await this.find(request, user);
    console.log(data);
    return await this.find(request, user);
  }

  @Query(() => UserOnboardingInfoResponse, { name: 'findJobSettingInfo' })
  findJobSettingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobSettingRequest })
    request: UserJobSettingRequest
  ) {
    return this.find(request, user);
  }

  

  @Query(() => UserOnboardingInfoResponse, { name: 'findSkillOnboarding' })
  async findSkillOnboarding(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest })
    request: UserOnboardingInfoRequest
  ) {
    console.log(request)
    return this.find(request, user);
  }

  @Query(() => UserOnboardingInfoResponse, { name: 'getParentCode' })
  async getParentCode(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest })
    request: UserOnboardingInfoRequest
  ) {
      const parentKey = request.condition?._key as string;
      const aqlQuery = `
          FOR v IN sys_master_data
          FILTER  v._key == ${parentKey}
          RETURN v.code 
      `;
      const result = await this.query(aqlQuery);
      return await this.query(aqlQuery);
  }

  @Mutation(() => UserOnboardingInfoResponse, {
    name: 'saveUserJobSettingInfo',
  })
  saveUserJobSettingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobSettingRequest })
    request: UserJobSettingRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => UserOnboardingInfoResponse, {
    name: 'saveUserOnboardingInfo',
  })
  saveUserOnboardingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest })
    request: UserOnboardingInfoRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => UserOnboardingInfoResponse, {
    name: 'removeUserOnboardingInfo',
  })
  removeUserOnboardingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest })
    request: UserOnboardingInfoRequest
  ) {
    return this.remove(request, user);
  }


  @Mutation(() => UserSkillResponse, { name: 'removeUserSkillByKey' })
  async removeUserSkillByKey(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserSkillRequest }) request: UserSkillRequest
  ) {
    //return this.remove(request, user);
    const user_id = request.user_id;
    const from = JSON.stringify(request.data[0]._from);
    if (user_id) {
      const aqlQuery = `
        FOR data IN user_skill
        FILTER data._from == ${from}
        UPDATE data WITH { del_flag: true } IN user_skill
        RETURN data
      `;
      console.log(aqlQuery);
      
      return await this.query(aqlQuery);
    } else {
      return new UserSkillResponse(RESULT_STATUS.ERROR, [], 'error');
    }
  }
}
