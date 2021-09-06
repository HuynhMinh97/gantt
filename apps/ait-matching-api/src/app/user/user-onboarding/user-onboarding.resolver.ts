/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserOnboardingInfoResponse } from './user-onboarding.response';
import { UserOnboardingInfoRequest } from './user-onboarding.request';

@Resolver()
export class UserOnboardingInfoResolver extends AitBaseService {
  collection = 'user_profile';

  @Query(() => UserOnboardingInfoResponse, { name: 'findUserOnboardingInfo' })
  findUserOnboardingInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserOnboardingInfoRequest }) request: UserOnboardingInfoRequest) {
    return this.find(request, user);
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