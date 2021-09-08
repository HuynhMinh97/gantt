import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserProjectRequest } from './user-project.request';
import { UserProjectResponse } from './user-project.response';

@Resolver()
export class UserProjectResolver extends AitBaseService {
    collection = 'biz-project';
    @Query(() => UserProjectResponse, { name: 'findUserProject' })
    async findJobInfo(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) { 
        const result = await this.find(request, user);
        return result;
    }
    
    @Query(() => UserProjectResponse, { name: 'findKey' })
    async findKey(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) { 
        const result = await this.find(request, user);
        return result;
    }

    @Mutation(() => UserProjectResponse, { name: 'saveUserProject' })
    saveUserProject(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) {
        return this.save(request, user);
    }

    @Mutation(() => UserProjectResponse, { name: 'removeUserProject' })
    removeUserProject(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) {
        return this.remove(request, user);
    }
}
