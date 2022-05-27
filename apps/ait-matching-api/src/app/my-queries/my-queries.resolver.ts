import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { MyQueriesEntity } from './my-queries.entity';
import { MyQueriesRequest, MyQueriesSearchRequest } from './my-queries.request';
import { MyQueriesResponse } from './my-queries.response';

@Resolver()
export class MyQueriesResolver extends AitBaseService {
  @Query(() => MyQueriesResponse, { name: 'findAllProjectCompany' })
  async findAllProjectCompany(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => MyQueriesRequest }) request: MyQueriesRequest
  ) {
    return this.find(request, user);
  }
  @Query(() => MyQueriesResponse, { name: 'searchProjectCompany' })
  async searchProjectCompany(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => MyQueriesSearchRequest })
    request: MyQueriesSearchRequest
  ) {
   
    const lang = request.lang;
    const skill = request?.condition?.skill.value[0];
    delete request.condition?.skill;
    
    const result = await this.find(request, user);
    const data = result.data;
    const project_list = [];
    for (const pro of data) {
      const nameSkill = [];
      for (const item of pro.skills) {
        const name_skill = await this.getNameOfSkill(item, lang);

        nameSkill.push(name_skill.data[0]);
      }
      const listNameSkill = nameSkill.join(', ');
      const project = { ...pro };
     
      project['skill'] = listNameSkill
      
      if (skill) {
        
        if (listNameSkill.includes(skill)) {
          project_list.push({ ...project });
        }
      } else {
        project_list.push({ ...project });
      }
    }
    const response = new MyQueriesResponse(
      200,
      project_list as MyQueriesEntity[],
      ''
    );
    return response;
  }

  async getNameOfSkill(_key: string, lang: string) {
    const aqlQuery = `
     FOR v IN m_skill
     filter v._key == "${_key}"
     RETURN v.name.${lang}
     `;
    return await this.query(aqlQuery);
  }

  async getNameUserByKey(_key: string) {
    const aqlQuery = `
     FOR v IN user_profile
     filter v.user_id == "${_key}"
     RETURN CONCAT (v.first_name,' ',v.last_name)
     `;
    return await this.query(aqlQuery);
  }
}
