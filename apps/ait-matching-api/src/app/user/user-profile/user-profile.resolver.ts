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

  @Query(() => UserProfileResponse, { name: 'findFriends' })
  async findFriends(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => UserProfileResponse, { name: 'saveFriends' })
  saveFriends(
      @AitCtxUser() user: SysUser,
      @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
      return this.save(request, user);
  }
  @Mutation(() => UserProfileResponse, { name: 'removeFriends' })
  async removeFriends(
      @AitCtxUser() user: SysUser,
      @Args('request', { type: () => UserProfileRequest }) request: UserProfileRequest
  ) {
      //return this.remove(request, user);
      const user_id = request.user_id;
      const from = JSON.stringify(request.data[0]._from);
      const to = JSON.stringify(request.data[0]._to);
      if (user_id) {
      const aqlQuery = `
      FOR data IN reaction_love
      FILTER data._from == ${from} && data._to == ${to} && data.del_flag != true
      UPDATE data WITH { del_flag: true } IN reaction_love
      RETURN data
      `;
        console.log(aqlQuery);
        
      return await this.query(aqlQuery);
      } else {
      return new UserProfileResponse(RESULT_STATUS.ERROR, [], 'error');
      }
  }

}
