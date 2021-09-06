/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserEducationInfoResponse } from './user-education.response';
import { UserEducationInfoRequest } from './user-education.request';

@Resolver()
export class UserEducationInfoResolver extends AitBaseService {
  collection = 'user_education';

  @Query(() => UserEducationInfoResponse, { name: 'findUserEducationInfo' })
  findUserEducationInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserEducationInfoRequest }) request: UserEducationInfoRequest) {
    return this.find(request, user);
  }

  @Mutation(() => UserEducationInfoResponse, { name: 'saveUserEducationInfo' })
  saveUserEducationInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserEducationInfoRequest }) request: UserEducationInfoRequest
  ) {    
    return this.save(request, user);
  }

  @Mutation(() => UserEducationInfoResponse, { name: 'removeUserEducationInfo' })
  removeUserEducationInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserEducationInfoRequest }) request: UserEducationInfoRequest
  ) {    
    return this.remove(request, user);
  }
}