import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Resolver,  Mutation, Args, Query } from '@nestjs/graphql';
import { ExampleRequest } from './example.request';
import { ExampleResponse } from './example.response';

@Resolver()
export class ExampleResolver extends AitBaseService {
  collection = 'example';

  @Query(() => ExampleResponse, { name: 'findExample' })
  findExample(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => ExampleRequest }) request: ExampleRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => ExampleResponse, { name: 'saveExample' })
  saveExample(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => ExampleRequest }) request: ExampleRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => ExampleResponse, { name: 'removeExample' })
  removeExample(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => ExampleRequest }) request: ExampleRequest
  ) {
    return this.remove(request, user);
  }
}
