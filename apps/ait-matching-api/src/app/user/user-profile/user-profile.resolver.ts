import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { RESULT_STATUS } from 'libs/shared/src/lib/commons/enums';
import { UserProfileRequest } from './user-profile.request';
import { UserProfileResponse as UserProfileResponse } from './user-profile.response';

@Resolver()
export class UserProfileResolver extends AitBaseService {

  @Query(() => UserProfileResponse, { name: 'findProfile' })
  findProfile(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
    return this.find(request, user);
  }

}
