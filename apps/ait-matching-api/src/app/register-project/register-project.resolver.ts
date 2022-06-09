import { cond } from 'lodash';
import { AitBaseService, AitCtxUser, SysUser } from '@ait/core';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CandidateEntity, RegisterProjectEntity } from './register-project.entity';
import { CandidateRequest, RegisterProjectRequest } from './register-project.request';
import { CandidateResponse, RegisterProjectResponse } from './register-project.response';
import { BreakingChangeType } from 'graphql';


@Resolver()
export class RegisterProjectResolver extends AitBaseService {
  @Query(() => RegisterProjectResponse, { name: 'findProjectAitByKey' })
  async findProjectAitByKey(
    @Args('request', { type: () => RegisterProjectRequest })
    request: RegisterProjectRequest
  ) {
    return await this.find(request);
  }
  @Mutation(() => RegisterProjectResponse, { name: 'saveCompanyProject' })
  saveCompanyProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => RegisterProjectRequest })
    request: RegisterProjectRequest
  ) {
    return this.save(request);
  }

  @Query(() => RegisterProjectResponse, { name: 'findSkillProject' })
  async findSkillProject(
    @AitCtxUser() user: SysUser,
    @Args('request', { type: () => RegisterProjectRequest })
    request: RegisterProjectRequest
  ) {
    const lang = request.lang;
    const _key = request.condition?._key;
    
    const aqlQuery = `
    FOR v IN biz_project
    filter v._key == "${_key}"
    RETURN v.skills
    `;
   const result =  await this.query(aqlQuery);
  
   const Skills = [];
   if (result.data[0]){
     for (const skill of result.data[0])
     {
       const skillName = await this.getNameOfSkill(skill, lang);
       const skills = {
         _key:skill,
         value:skillName.data[0]
       }
       Skills.push({skills})
     }
   }
   else {
    const skills = {
      _key:null,
      value:null
    }
    Skills.push({skills})
   }
   
    const response = new RegisterProjectResponse(
      200,
      Skills as RegisterProjectEntity[],
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

  @Query(() => CandidateResponse, { name: 'getBizProjectUser' })
  async getBizProjectUser(
    @Args('request', { type: () => CandidateRequest })
    request: CandidateRequest
  ) {
    const biz_project_key = request.condition?._key
    delete request.condition?._key;
    const _from = 'biz_project/' + biz_project_key;
    const aqlQuery = `
    FOR a,e,v IN 1..1 OUTBOUND "${_from}" biz_project_user
        RETURN e`
    const result = await this.query(aqlQuery);
    const listData = result.data;
    
    const rq = { ...request };
    rq['collection'] = 'user_profile';
    delete rq.condition;
    const res = await this.find(rq);
    const userList = res.data || [];
    const userArr = [];
    for (const data of listData) {
      const user_id = data._to.split("/").splice(1,1);
      
      let first_name = '';
      let last_name = '';
      for (const user of userList) {
        
        if (user.user_id == user_id) {
          first_name = user.first_name;
          last_name = user.last_name;
          
          break;
        }
      }
          userArr.push({
            ...data,
            first_name: first_name,
            last_name: last_name,
            user_id : user_id[0],
          });
        
    }
    const response = new CandidateResponse(
      200,
      userArr as CandidateEntity[],
      ''
    );
    return response;
  }
  
}
