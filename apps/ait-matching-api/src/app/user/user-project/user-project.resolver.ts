import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { RESULT_STATUS } from '@ait/shared';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UserProjectRequest } from './user-project.request';
import { UserProjectResponse } from './user-project.response';

@Resolver()
export class UserProjectResolver extends AitBaseService {
  collection = 'user-project';
  @Query(() => UserProjectResponse, { name: 'findUserProject' })
  async findJobInfo(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProjectRequest })
    request: UserProjectRequest
  ) {
    const lang = request.lang
    const to = 'sys_user/'+request.condition?.user_id
    const result = await this.find(request, user);
    const aqlQuery = `
    FOR a,e,v IN 1..1 INBOUND "${to}" biz_project_user
    FILTER  e.del_flag != true
    RETURN a
    `;
    const data = await this.query(aqlQuery);
    const name_title = [];
    for (const item of data.data) {
      if (item.title.length > 0) {

        for (const title of item.title){
          const title_names = await this.getNameTileByKey(title, lang);
          name_title.push(title_names.data[0]);
        }
        item['name_title'] = name_title.join(', ')
      }
      item['company_working'] = { _key: null, value: 'AIT' }
      item['start_date_from'] = item['capacity_time_from']
      item['start_date_to'] = item['capacity_time_to']
      item['project_name'] = { _key: item['name'], value: item['name'] }
    }
    
    result.data.push(...data.data)
    return result;
  }

  async getNameTileByKey(_key: string, lang: string, ) {
    const aqlQuery = `
     FOR v IN m_title
     filter v._key == "${_key}"
     RETURN v.name.${lang}
     `;
    return await this.query(aqlQuery);
  }



  @Query(() => UserProjectResponse, { name: 'findKey' })
  async findKey(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProjectRequest })
    request: UserProjectRequest
  ) {
    const result = await this.find(request, user);
    return result;
  }

  @Query(() => UserProjectResponse, { name: 'findMSkills' })
  async findMSkills(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProjectRequest })
    request: UserProjectRequest
  ) {
    const result = await this.find(request, user);
    return result;
  }

  @Mutation(() => UserProjectResponse, { name: 'saveSkill' })
  saveUserSkill(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProjectRequest })
    request: UserProjectRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => UserProjectResponse, { name: 'saveConnectionUserProject' })
  saveConnectionUserProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProjectRequest })
    request: UserProjectRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => UserProjectResponse, { name: 'saveUserProject' })
  saveUserProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProjectRequest })
    request: UserProjectRequest
  ) {
    return this.save(request, user);
  }

  @Mutation(() => UserProjectResponse, { name: 'removeProject' })
  removeProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProjectRequest })
    request: UserProjectRequest
  ) {
    return this.remove(request, user);
  }

  @Mutation(() => UserProjectResponse, { name: 'removeSkillProject' })
  async removeSkillProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => UserProjectRequest })
    request: UserProjectRequest
  ) {
    //return this.remove(request, user);
    const user_id = request.user_id;
    const from = JSON.stringify(request.data[0]._from);
    if (user_id) {
      const aqlQuery = `
        FOR data IN user_project_skill
        FILTER data._from == ${from}
        UPDATE data WITH { del_flag: true } IN user_project_skill
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
    @Args('request', { type: () => UserProjectRequest })
    request: UserProjectRequest
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
