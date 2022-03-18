/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserOnboardingInfoResponse } from './user-onboarding.response';
import { UserJobSettingRequest, UserOnboardingInfoRequest } from './user-onboarding.request';

@Resolver()
export class UserOnboardingInfoResolver extends AitBaseService {
  collection = 'user_profile';

  @Query(() => UserOnboardingInfoResponse, { name: 'findUserOnboardingInfo' })
  findUserOnboardingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest }) request: UserOnboardingInfoRequest) {
    return this.find(request, user);
  }

  @Query(() => UserOnboardingInfoResponse, { name: 'findJobSettingInfo' })
  findJobSettingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobSettingRequest }) request: UserJobSettingRequest) {
    return this.find(request, user);
  }

  @Query(() => UserOnboardingInfoResponse, { name: 'findCurrentJobSkill' })
  async findCurrentJobSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobSettingRequest }) request: UserJobSettingRequest) {
      const _from = request.condition?._key;
      const lang = request.lang;
      const aqlQuery = `
        FOR v IN 1..1 OUTBOUND "${_from}" biz_user_skill
        RETURN v.name.${lang}
      `;
      const skills = await this.query(aqlQuery);
    return skills.data;
  }

  @Query(() => UserOnboardingInfoResponse, { name: 'findSkillOnboarding' })
  findSkillOnboarding(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest }) request: UserOnboardingInfoRequest) {
    return this.find(request, user);
  }

  @Mutation(() => UserOnboardingInfoResponse, { name: 'saveUserJobSettingInfo' })
  saveUserJobSettingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobSettingRequest }) request: UserJobSettingRequest
  ) {    
    return this.save(request, user);
  }

  @Mutation(() => UserOnboardingInfoResponse, { name: 'saveUserOnboardingInfo' })
  saveUserOnboardingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest }) request: UserOnboardingInfoRequest
  ) {    
    return this.save(request, user);
  }

  @Mutation(() => UserOnboardingInfoResponse, { name: 'removeUserOnboardingInfo' })
  removeUserOnboardingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest }) request: UserOnboardingInfoRequest
  ) {    
    return this.remove(request, user);
  }
}