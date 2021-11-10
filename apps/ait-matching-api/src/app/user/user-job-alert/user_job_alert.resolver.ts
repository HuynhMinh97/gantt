import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserJobAlertRequest } from './user_job_alert.request';
import { UserJobAlertResponse } from './user_job_alert.response';

@Resolver()
export class UserJobAlertResolver extends AitBaseService {
  collection = 'user_cerfiticat';

  @Query(() => UserJobAlertResponse, { name: 'findUserJobAlert' })
  async findUserJobAlert(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobAlertRequest }) request: UserJobAlertRequest) {         
    return this.find(request, user);
  }

  @Mutation(() => UserJobAlertResponse, { name: 'saveUserJobAlert' })
  saveUserJobAlert(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobAlertRequest }) request: UserJobAlertRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => UserJobAlertResponse, { name: 'removeUsercertificate' })
  removeUsercertificate(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserJobAlertRequest }) request: UserJobAlertRequest
  ) {
    return this.remove(request, user);
  }
}