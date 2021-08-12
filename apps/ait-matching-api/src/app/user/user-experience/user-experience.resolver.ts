import { UserExperienceInfoRequest } from './user-experience.request';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
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

  private getMasterDataArray(data: string[], dataMaster: any[]): KeyValueDto[] {
    let res = [];
    if (data.length !== 0) {
      res = data.map(d => {
        const ret = dataMaster.find(f => f.code === d);
        return {
          _key: ret?._key,
          value: ret?.name
        }
      })
      return res
    }
    return res;
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