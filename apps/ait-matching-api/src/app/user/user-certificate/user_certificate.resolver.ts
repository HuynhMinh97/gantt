import { AitBaseService, AitCtxUser, KeyValueDto, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserCertificateRequest } from './user_certificate.request';
import { UserCertificateResponse } from './user_certificate.response';

@Resolver()
export class UserCertificateResolver extends AitBaseService {
  collection = 'user_cerfiticat';

  @Query(() => UserCertificateResponse, { name: 'findUsercertificate' })
  async findUsercertificate(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserCertificateRequest }) request: UserCertificateRequest) {         
    return this.find(request, user);
  }

  @Mutation(() => UserCertificateResponse, { name: 'saveUsercertificate' })
  saveUsercertificate(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserCertificateRequest }) request: UserCertificateRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => UserCertificateResponse, { name: 'removeUsercertificate' })
  removeUsercertificate(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserCertificateRequest }) request: UserCertificateRequest
  ) {
    return this.remove(request, user);
  }
}