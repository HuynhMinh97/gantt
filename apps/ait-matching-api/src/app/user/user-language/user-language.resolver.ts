/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserLanguageInfoResponse } from './user-Language.response';
import { UserLanguageInfoRequest } from './user-Language.request';

@Resolver()
export class UserLanguageInfoResolver extends AitBaseService {
  collection = 'user_language';

  @Query(() => UserLanguageInfoResponse, { name: 'findUserLanguageInfo' })
  findUserLanguageInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserLanguageInfoRequest }) request: UserLanguageInfoRequest) {
    return this.find(request, user);
  }

  @Mutation(() => UserLanguageInfoResponse, { name: 'saveUserLanguageInfo' })
  saveUserLanguageInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserLanguageInfoRequest }) request: UserLanguageInfoRequest
  ) {    
    return this.save(request, user);
  }

  @Mutation(() => UserLanguageInfoResponse, { name: 'removeUserLanguageInfo' })
  removeUserLanguageInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserLanguageInfoRequest }) request: UserLanguageInfoRequest
  ) {    
    return this.remove(request, user);
  }
}