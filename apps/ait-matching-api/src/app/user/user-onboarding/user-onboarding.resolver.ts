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

@Resolver()
export class UserOnboardingInfoResolver extends AitBaseService {
  collection = 'user_profile';

  @Query(() => UserOnboardingInfoResponse, { name: 'findUserOnboardingInfo' })
  findUserOnboardingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest })
    request: UserOnboardingInfoRequest
  ) {
    return this.find(request, user);
  }

  @Query(() => UserOnboardingInfoResponse, { name: 'findJobSettingInfo' })
  findJobSettingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobSettingRequest })
    request: UserJobSettingRequest
  ) {
    return this.find(request, user);
  }

  // @Query(() => CurrentJobSkillsResponse, { name: 'findCurrentJobSkill' })
  // async findCurrentJobSkill(
  //   @AitCtxUser() user: SysUser,
  //   @Args('request', { type: () => UserJobSettingRequest })
  //   request: UserJobSettingRequest
  // ) {
  //   const _from = request.condition?._key;
  //   const lang = request.lang;
  //   const aqlQuery = `
  //       FOR v IN 1..1 OUTBOUND "${_from}" biz_user_skill
  //       RETURN v._id
  //     `;
  //   const skills = await this.query(aqlQuery);
  //   const currentSkills = skills.data;
  //   const rq = { ...request };
  //   rq['collection'] = 'm_skill';
  //   delete rq.condition;
  //   const res = await this.find(rq);
  //   const skillList = res.data || [];
  //   const arr = []
  //   currentSkills.forEach((data) => {
  //     const ski = {}
  //     const skill = skillList.find((sk) => sk._id === data);
  //     ski['_key'] = skill.code; ski['value'] = skill.name
  //    arr.push(ski)
  //   });
  //   const response = new CurrentJobSkillsResponse(
  //     200,
  //     arr as CurrentJobSkillsEntity[],
  //     ''
  //   );
  //   console.log(response);
  //   return response;
  // }

  @Query(() => UserOnboardingInfoResponse, { name: 'findSkillOnboarding' })
  findSkillOnboarding(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest })
    request: UserOnboardingInfoRequest
  ) {
    return this.find(request, user);
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
}
