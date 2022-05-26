/* eslint-disable @typescript-eslint/no-explicit-any */
import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { UserEducationInfoResponse } from './user-education.response';
import { UserEducationInfoRequest } from './user-education.request';
import { UserEducationInfoEntity } from './user-education.entity';

@Resolver()
export class UserEducationInfoResolver extends AitBaseService {
  collection = 'user_education';

  @Query(() => UserEducationInfoResponse, { name: 'findUserEducationInfo' })
  async findUserEducationInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserEducationInfoRequest }) request: UserEducationInfoRequest) {
    const result = await this.find(request, user);
    const listData = result.data;

    const rq = { ...request };
    rq['collection'] = 'user_profile';
    delete rq.condition;
    const res = await this.find(rq);
    const userList = res.data || [];
    const userArr = [];
    if(listData){
      listData.forEach((data) => {
        const obj = userList.find((u) => u.user_id === data.user_id);
      if (obj) {
        userArr.push({
          ...data,
          first_name: obj.first_name,
          last_name: obj.last_name,
        });
      }
    });
  }
    
    
    const response = new UserEducationInfoResponse(
      200,
      userArr as UserEducationInfoEntity[],
      ''
    );
    return response;
   
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