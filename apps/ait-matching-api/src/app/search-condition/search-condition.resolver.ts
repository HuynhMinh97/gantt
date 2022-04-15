import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { SearchConditionRequest } from './search-condition.request';
import { SearchConditionResponse } from './search-condition.response';

@Resolver()
export class SearchConditionResolver extends AitBaseService {
  collection = 'save_recommend_user_query';

  @Query(() => SearchConditionResponse, { name: 'findSearchCondition' })
  findSearchCondition(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SearchConditionRequest })
    request: SearchConditionRequest
  ) {
    return this.find(request, user);
  }

  @Mutation(() => SearchConditionResponse, { name: 'saveSearchCondition' })
  saveSearchCondition(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SearchConditionRequest })
    request: SearchConditionRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => SearchConditionResponse, { name: 'removeSearchCondition' })
  removeSearchCondition(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => SearchConditionRequest })
    request: SearchConditionRequest
  ) {
    return this.remove(request, user);
  }
}
