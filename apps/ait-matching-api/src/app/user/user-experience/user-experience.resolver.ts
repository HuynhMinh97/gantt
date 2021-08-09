import { UserExperienceInfoRequest } from './user-experience.request';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Utils } from '@ait/shared';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserExperienceInfoResponse } from './user-experience.response';

@Resolver()
export class UserExperienceInfoResolver extends AitBaseService {
  collection = 'user_experience';

  @Query(() => UserExperienceInfoResponse, { name: 'findUserExperienceInfo' })
  findUserExperienceInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserExperienceInfoRequest }) request: UserExperienceInfoRequest) {
    return this.find(request, user);
  }

  @Mutation(() => UserExperienceInfoResponse, { name: 'saveUserExperienceInfo' })
  saveUserExperienceInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserExperienceInfoRequest }) request: UserExperienceInfoRequest
  ) {    
    return this.save(request, user);
  }

  @Mutation(() => UserExperienceInfoResponse, { name: 'removeUserExperienceInfo' })
  removeUserExperienceInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserExperienceInfoRequest }) request: UserExperienceInfoRequest
  ) {    
    return this.remove(request, user);
  }
}