import { RESULT_STATUS } from 'libs/shared/src/lib/commons/enums';
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

    @Query(() => UserProjectResponse, { name: 'findMSkills' })
    async findMSkills(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) {  
        const result = await this.find(request, user);
        console.log(result);
        
        return result;
    }

    @Mutation(() => UserProjectResponse, { name: 'saveSkill' })
    saveUserSkill(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) {
        return this.save(request, user);
    }

    @Mutation(() => UserProjectResponse, { name: 'saveConnectionUserProject' })
    saveConnectionUserProject(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) {
        return this.save(request, user);
    }

    @Mutation(() => UserProjectResponse, { name: 'saveUserProject' })
    saveUserProject(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) {
        return this.save(request, user);
    }

    @Mutation(() => UserProjectResponse, { name: 'removeProject' })
    removeProject(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) {
        return this.remove(request, user);
    }

    @Mutation(() => UserProjectResponse, { name: 'removeSkill' })
    async removeSkill(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) {
        //return this.remove(request, user);
        const user_id = request.user_id;

        if (user_id) {
        const aqlQuery = `
        FOR item IN biz_project_skill
        FOR data IN biz_project_skill
        FILTER data._from == item._from
        UPDATE data WITH { del_flag: true } IN biz_project_skill
        RETURN data
        `;

        return await this.query(aqlQuery);
        } else {
        return new UserProjectResponse(RESULT_STATUS.ERROR, [], 'error');
        }
    }

    @Mutation(() => UserProjectResponse, { name: 'removeUserProject' })
    async removeUserProject(
        @AitCtxUser() user: SysUser,
        @Args('request', { type: () => UserProjectRequest }) request: UserProjectRequest
    ) {
        //return this.remove(request, user);
        const user_id = request.user_id;

        if (user_id) {
        const aqlQuery = `
        FOR item IN connection_user_project
        FOR data IN connection_user_project
        FILTER data._to == item._to
        UPDATE data WITH { del_flag: true } IN connection_user_project
        RETURN data
        `;

        return await this.query(aqlQuery);
        } else {
        return new UserProjectResponse(RESULT_STATUS.ERROR, [], 'error');
        }
    }
}
