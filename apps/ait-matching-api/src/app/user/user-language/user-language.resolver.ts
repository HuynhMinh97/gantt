/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserLanguageInfoResponse } from './user-language.response';
import { UserLanguageInfoRequest } from './user-language.request';

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